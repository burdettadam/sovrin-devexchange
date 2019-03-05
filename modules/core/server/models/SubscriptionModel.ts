'use strict';

import { Document, Model, model, Schema } from 'mongoose';

export interface ISubscriptionModel extends Document {
	_id: string;
	id: string;
	name: string;
	email: string;
}

// This is the model used to store a newsletter subscription
const SubscriptionSchema = new Schema(
	{
		name: { type: String, default: '', required: 'Name is required', trim: true },
		email: { type: String, default: '', required: 'Email is required', trime: true }
	},
	{ usePushEach: true }
)

export const SubscriptionModel: Model<ISubscriptionModel> = model<ISubscriptionModel>('Subscription', SubscriptionSchema);
