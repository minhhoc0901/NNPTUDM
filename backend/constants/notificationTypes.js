const NOTIFICATION_TYPES = {
  // System
  SYSTEM: 'system',
  // Tour
  TOUR_PENDING: 'tour_pending',
  TOUR_APPROVED: 'tour_approved',
  TOUR_REJECTED: 'tour_rejected',
  TOUR_UPDATE: 'tour_update',
  
  // Review & Comment
  NEW_REVIEW: 'new_review',
  NEW_LOCATION_COMMENT: 'new_location_comment',
  
  // Message
  NEW_MESSAGE: 'new_message',
  ADMIN_NEW_BOOKING: 'admin_new_booking',
  ADMIN_PAYMENT_SUCCESS: 'admin_new_payment'
};

module.exports = NOTIFICATION_TYPES;