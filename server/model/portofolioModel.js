import mongoose from 'mongoose';

const stockSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    stockTicker: { type: String, required: true },
    industry: { type: String, required: true },
    growthRate_1_5_Year: { type: Number, required: true },
    growthRate_6_10_Year: { type: Number, required: true },
    discountRate: { type: Number, required: true },
    terminalValue: { type: Number, required: true },
    freeCashFlowYear1: { type: Number, required: true },
    excessCapitalCash: { type: Number, required: true },
    presentValueFutureCashFlow: { type: Number, required: true },
    instrinsicValueByCap: { type: Number, required: true },
    safetyNetValueCap: { type: Number, required: true },
    marketCap: { type: Number, required: true },
    amountOfShares: { type: Number, required: true },
    currentSharePrice: { type: Number, required: true },
    instrinsicValueByShare: { type: Number, required: true },
    safetyNetValueShare: { type: Number, required: true },
    valueAsPercentage: { type: Number, required: true },
  },
  { timestamps: true }
);

const portofolioSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    stocksWatchList: [stockSchema],
  },
  { timestamps: true }
);

const Portofolio = mongoose.model('Portofolio', portofolioSchema);

export default Portofolio;
