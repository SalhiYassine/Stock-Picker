import asyncHandler from 'express-async-handler';
import Portofolio from '../model/portofolioModel.js';

// @desc    Fetch user portofolio
// @route   GET /api/portofolio/
// @access  private
export const getUserPortofolio = asyncHandler(async (req, res) => {
  const portofolio = await Portofolio.find({ user: req.user._id });
  if (portofolio) {
    res.json(portofolio);
  } else {
    res.status(404);
    throw new Error('User Does not have a portofolio');
  }
});

// @desc    Fetch user portofolio
// @route   POST /api/portofolio/stock
// @access  private
export const addStockToUserPortofolio = asyncHandler(async (req, res) => {
  const portofolio = await Portofolio.find({ user: req.user._id });
  if (portofolio) {
    const { stockTicker } = req.body;
    if (stockTicker) {
      let stock = 'request to api using ticker';
      portofolio.stocks.push({
        user: req.user._id,
        name: req.user.name,
        stockTicker: {},
        industry: {},
        growthRate_1_5_Year: {},
        growthRate_6_10_Year: {},
        discountRate: {},
        terminalValue: {},
        freeCashFlowYear1: {},
        excessCapitalCash: {},
        presentValueFutureCashFlow: {},
        instrinsicValueByCap: {},
        safetyNetValueCap: {},
        marketCap: {},
        amountOfShares: {},
        currentSharePrice: {},
        instrinsicValueByShare: {},
        safetyNetValueShare: {},
        valueAsPercentage: {},
      });
      res.json(portofolio);
    } else {
      res.status(404);
      throw new Error('User did not send a valid stock ticker');
    }
  } else {
    res.status(404);
    throw new Error('User Does not have a portofolio');
  }
});
