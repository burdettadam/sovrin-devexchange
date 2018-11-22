import * as mongoose from 'mongoose';

export class OpportunitiesUtilities {
	private Opportunity = mongoose.model('Opportunity');

	// Returns a list of all opportunities
	public opplist = (query, req, callback) => {
		this.Opportunity.find(query)
			.sort([['deadline', -1], ['name', 1]])
			.populate('createdBy', 'displayName')
			.populate('updatedBy', 'displayName')
			.populate('project', 'code name _id isPublished')
			.populate('program', 'code title _id logo isPublished')
			.populate('phases.implementation.capabilities', 'code name')
			.populate('phases.implementation.capabilitiesCore', 'code name')
			.populate('phases.implementation.capabilitySkills', 'code name')
			.populate('phases.inception.capabilities', 'code name')
			.populate('phases.inception.capabilitiesCore', 'code name')
			.populate('phases.inception.capabilitySkills', 'code name')
			.populate('phases.proto.capabilities', 'code name')
			.populate('phases.proto.capabilitiesCore', 'code name')
			.populate('phases.proto.capabilitySkills', 'code name')
			.populate('phases.aggregate.capabilities', 'code name')
			.populate('phases.aggregate.capabilitiesCore', 'code name')
			.populate('phases.aggregate.capabilitySkills', 'code name')
			.exec((err, opportunities) => {
				if (err) {
					callback(err, null);
				} else {
					callback(
						null,
						this.decorateList(
							opportunities,
							req.user ? req.user.roles : []
						)
					);
				}
			});
	}

	// This takes a opportunity model, serializes it, and decorates it with what
	// relationship the user has to the opportunity, and returns the JSON
	public decorate = (opportunityModel, roles) => {
		const opportunity = opportunityModel ? opportunityModel.toJSON() : {};
		opportunity.userIs = {
			admin: roles.indexOf(opportunity.code + '-admin') !== -1,
			member: roles.indexOf(opportunity.code) !== -1,
			request: roles.indexOf(opportunity.code + '-request') !== -1,
			gov: roles.indexOf('gov') !== -1
		};
		return opportunity;
	}

	// Decorate an entire list of opportunities
	public decorateList = (opportunityModels, roles) => {
		return opportunityModels.map(opportunityModel => {
			return this.decorate(opportunityModel, roles);
		});
	}
}
