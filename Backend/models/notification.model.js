import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    medicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medication',
        required: true
    },
    type: {
        type: String,
        enum: ['medication_reminder', 'medication_missed', 'medication_taken', 'goal_achieved', 'general'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timeSlot: {
        type: String,
        enum: ['morning', 'afternoon', 'evening', 'night']
    },
    scheduledTime: {
        type: String // HH:MM format
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'delivered', 'failed', 'read'],
        default: 'pending'
    },
    deliveryMethods: [{
        method: {
            type: String,
            enum: ['email', 'sms', 'push', 'in_app', 'webhook']
        },
        status: {
            type: String,
            enum: ['pending', 'sent', 'delivered', 'failed'],
            default: 'pending'
        },
        sentAt: Date,
        deliveredAt: Date,
        error: String
    }],
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    readAt: Date,
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    }
}, {
    timestamps: true
});

// Indexes for better performance
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ status: 1, createdAt: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static methods
notificationSchema.statics.findByUser = function(userId, limit = 50, skip = 0) {
    return this.find({ userId })
        .populate('medicationId', 'name dosage medicationType')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);
};

notificationSchema.statics.findUnreadByUser = function(userId) {
    return this.find({ 
        userId, 
        status: { $in: ['sent', 'delivered'] },
        readAt: { $exists: false }
    }).populate('medicationId', 'name dosage medicationType');
};

notificationSchema.statics.markAsRead = function(notificationId, userId) {
    return this.findOneAndUpdate(
        { _id: notificationId, userId },
        { 
            status: 'read',
            readAt: new Date()
        },
        { new: true }
    );
};

notificationSchema.statics.markAllAsRead = function(userId) {
    return this.updateMany(
        { 
            userId, 
            status: { $in: ['sent', 'delivered'] },
            readAt: { $exists: false }
        },
        { 
            status: 'read',
            readAt: new Date()
        }
    );
};

// Instance methods
notificationSchema.methods.markAsRead = function() {
    this.status = 'read';
    this.readAt = new Date();
    return this.save();
};

notificationSchema.methods.updateDeliveryStatus = function(method, status, error = null) {
    const deliveryMethod = this.deliveryMethods.find(dm => dm.method === method);
    if (deliveryMethod) {
        deliveryMethod.status = status;
        if (status === 'sent') {
            deliveryMethod.sentAt = new Date();
        } else if (status === 'delivered') {
            deliveryMethod.deliveredAt = new Date();
        } else if (status === 'failed') {
            deliveryMethod.error = error;
        }
    }
    return this.save();
};

export default mongoose.model('Notification', notificationSchema);
