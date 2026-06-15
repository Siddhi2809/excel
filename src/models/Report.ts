import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'platform_overview',
      'top_post',
      'ad_campaign',
      'audience_insight',
      'competitors_snapshot',
      'recommendation',
      'summary'
    ],
  },
  clientId: {
    type: String, // Matches User.clientId
    required: true,
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the employee who submitted it
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed, // Flexible object to store different report structures
    required: true,
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread',
  },
  month: {
    type: String, // e.g., 'June 2026'
    required: true,
  }
}, { timestamps: true });

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
