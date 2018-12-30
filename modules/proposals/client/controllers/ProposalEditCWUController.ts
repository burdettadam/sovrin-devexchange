'use strict';

import angular, { angularFileUpload, IFormController, IRootScopeService, uiNotification } from 'angular';
import { IStateService } from 'angular-ui-router';
import OpportunitiesService, { IOpportunityResource } from '../../../opportunities/client/services/OpportunitiesService';
import AuthenticationService from '../../../users/client/services/AuthenticationService';
import IUserDocument from '../../../users/server/interfaces/IUserDocument';
import ProposalService, { IProposalResource } from '../services/ProposalService';

export default class ProposalEditCWUController {
	public static $inject = [
		'editing',
		'$scope',
		'ask',
		'Upload',
		'$state',
		'proposal',
		'opportunity',
		'authenticationService',
		'proposalService',
		'opportunitiesService',
		'UsersService',
		'Notification',
		'org',
		'TINYMCE_OPTIONS'
	];

	public members: any[];
	public title: string;
	public proposalForm: IFormController;

	private user: IUserDocument;

	constructor(
		public editing: boolean,
		private $scope: IRootScopeService,
		private ask,
		private Upload: angularFileUpload.IUploadService,
		private $state: IStateService,
		public proposal: IProposalResource,
		public opportunity: IOpportunityResource,
		private authenticationService: AuthenticationService,
		private proposalService: ProposalService,
		private opportunitiesService: OpportunitiesService,
		private UsersService,
		private Notification: uiNotification.INotificationService,
		public org,
		public TINYMCE_OPTIONS
	) {
		// if not editing (i.e. creating), ensure that the current user doesn't already have a proposal started for this opp
		// if they do, transition to edit view for that proposal
		this.checkForExisting();

		// refresh the view based on passed in proposal
		this.refreshProposal(this.proposal);

		// set the user
		this.user = this.authenticationService.user;
	}

	// Save the proposal
	public async save(isValid: boolean, successMessage?: string): Promise<void> {
		if (!isValid) {
			this.$scope.$broadcast('show-errors-check-validity', 'ppp.form.proposalform');
			return;
		}

		if (!successMessage) {
			successMessage = 'Changes Saved';
		}

		try {
			// First, check with server to ensure deadline hasn't passed
			const response = await this.opportunitiesService.getOpportunityResourceClass().getDeadlineStatus({ opportunityId: this.opportunity._id });
			if (response.deadlineStatus === 'CLOSED') {
				this.Notification.error({
					title: 'Error',
					message: '<i class="fas fa-3x fa-exclamation-triangle"></i> Deadline has passed!'
				});
				return;
			}

			// Save the current user (proposal contact info tied to user - TODO: unlink this)
			const updatedUser = await this.UsersService.update(this.user).$promise;
			this.user = this.authenticationService.user = updatedUser;

			// Save the proposal
			this.copyUserInfo();
			let updatedProposal: IProposalResource;
			if (this.editing) {
				updatedProposal = await this.proposalService.getProposalResourceClass().update(this.proposal).$promise;
			} else {
				updatedProposal = await this.proposalService.getProposalResourceClass().create(this.proposal).$promise;
			}

			this.refreshProposal(updatedProposal);
			this.Notification.success({
				title: 'Success',
				message: `<i class="fas fa-check-circle"></i> ${successMessage}`
			});

			// if this is a newly created proposal, transition to edit view
			if (!this.editing) {
				this.$state.go('proposaladmin.editcwu', { proposalId: this.proposal._id, opportunityId: this.opportunity.code });
			}
		} catch (error) {
			this.handleError(error);
		}
	}

	// Leave the edit view
	public close(): void {
		this.$state.go('opportunities.viewcwu', { opportunityId: this.opportunity.code });
	}

	// Delete a proposal
	public async delete(): Promise<void> {
		const confirmMessage = 'Are you sure you want to delete your proposal? All your work will be lost.';
		const choice = await this.ask.yesNo(confirmMessage);
		if (choice) {
			try {
				await this.proposal.$remove();
				this.proposalForm.$setPristine();
				this.$state.go('opportunities.viewcwu', { opportunityId: this.opportunity.code });
				this.Notification.success({
					title: 'Success',
					message: '<i class="fas fa-check-circle"></i> Proposal Deleted'
				});
			} catch (error) {
				this.handleError(error);
			}
		}
	}

	// Withdraw a proposal
	public withdraw(): void {
		this.proposal.status = 'Draft';
		this.save(true, 'Proposal Withdrawn');
	}

	// Submit the proposal
	public submit(): void {
		this.proposal.status = 'Submitted';
		this.save(true, 'Proposal Submitted');
	}

	// Upload documents as attachments to proposal
	public async upload(file: File): Promise<void> {
		if (!file) {
			return;
		}

		if (file.size > 3 * 1024 * 1024) {
			this.Notification.error({
				delay: 6000,
				title: '<div class="text-center"><i class="fas fa-exclamation-triangle"></i> File Too Large</div>',
				message: '<div class="text-center">This file exceeds the max allowed size of 1M. Please select another image, or reduce the size or density of this image.</div>'
			});
		} else {
			try {
				const response = await this.Upload.upload({
					url: `/api/proposals/${this.proposal._id}/documents`,
					data: {
						file
					},
					method: 'POST'
				});

				this.Notification.success({
					title: 'Success',
					message: '<i class="fas fa-check-circle"></i> Attachment Uploaded'
				});

				const updatedProposal = response.data as IProposalResource;
				this.refreshProposal(updatedProposal);
			} catch (error) {
				this.handleError(error);
			}
		}
	}

	// Delete an attachment from a proposal
	public async deleteAttachment(fileId: string): Promise<void> {
		try {
			const updatedProposal = await this.proposalService.getProposalResourceClass().removeDoc({
				proposalId: this.proposal._id,
				documentId: fileId
			}).$promise;

			this.Notification.success({
				title: 'Success',
				message: '<i class="fas fa-check-circle"></i> Attachment Removed'
			});

			this.refreshProposal(updatedProposal);
		} catch (error) {
			this.handleError(error);
		}
	}

	// Get a font-awesome icon name for the given file type
	public getIconName(type: string): string {
		if (type.indexOf('pdf') > -1) {
			return 'fa-file-pdf';
		} else if (type.indexOf('image') > -1) {
			return 'fa-file-image';
		} else if (type.indexOf('word') > -1) {
			return 'fa-file-word';
		} else if (type.indexOf('excel') > -1 || type.indexOf('sheet') > -1) {
			return 'fa-file-excel';
		} else if (type.indexOf('powerpoint') > -1) {
			return 'fa-file-powerpoint';
		} else {
			return 'fa-file';
		}
	}

	private async checkForExisting(): Promise<void> {
		if (!this.editing) {
			const myProposal = await this.proposalService.getProposalResourceClass().getMyProposal({ opportunityId: this.opportunity.code }).$promise;

			if (myProposal && myProposal._id) {
				this.$state.go('proposaladmin.editcwu', { proposalId: myProposal._id, opportunityId: this.opportunity.code });
			}
		}
	}

	private refreshProposal(newProposal: IProposalResource): void {
		this.proposal = newProposal;

		this.members = [];
		if (this.org) {
			this.org.fullAddress = this.org.address + (this.org.address2 ? ', ' + this.org.address2 : '') + ', ' + this.org.city + ', ' + this.org.province + ', ' + this.org.postalcode;
			this.members = this.org.members.concat(this.org.admins);
		}

		this.title = this.editing ? 'Edit' : 'Create';
		if (!this.proposal.team) {
			this.proposal.team = [];
		}

		// ensure status set accordingly
		if (!this.editing) {
			this.proposal.status = 'New';
		}
	}

	// Copy over user and org information to the proposal
	private copyUserInfo(): void {
		this.proposal.opportunity = this.opportunity;

		this.proposal.businessName = this.user.businessName;
		this.proposal.businessAddress = this.user.businessAddress;
		this.proposal.businessContactName = this.user.businessContactName;
		this.proposal.businessContactEmail = this.user.businessContactEmail;
		this.proposal.businessContactPhone = this.user.businessContactPhone;
	}

	private handleError(error: any): void {
		const errorMessage = (error as any).data ? (error as any).data.message : error.message;
		this.Notification.error({
			title: 'Error',
			message: `<i class="fas fa-exclamation-triangle"></i> ${errorMessage}`
		});
	}
}

angular.module('proposals').controller('ProposalEditCWUController', ProposalEditCWUController);
