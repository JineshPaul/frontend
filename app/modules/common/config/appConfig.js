(function(){
	'use strict';
	angular
		.module('finApp.config',[])
		.constant('appConfig',{
			'version': 0.01,
			//'API_BASE_URL' : 'http://10.97.11.86/v3.0',
			'API_BASE_URL' : 'http://54.169.104.90/v3.0',			
			'restrictedPages' : [
				// '/dashboard',
				// '/planInvest',
				// '/quickInvest',
				// '/quickInvestStart'
			],
			'noTokenAPI':[
				'/user/login/',
	        	'/core/assess/new/response/',
	        	'/user/register/'
			],
			'pagesWithAlreadySignMsg':[
				'/gettingStarted',
				'/riskAssesment',
				'/riskAssesmentMoreQuestions'
			],
			'pagesWithOnlyMenu':[
				'/registration'
			],
			'retirement' : {
				'0' : [
					{
						'tip' : 'Starting early in retirement goal can make a big difference to your corpus at the time of retirement.',
					}
				],
				'1' : [
					{
						'tip' : '<span class="currency">&#8377</span>1 Crore in 20',
					},
				]
			},
			'riskProfile' : {
				'low' : 'low',
				'belowAverage' : 'belowAverage',
				'average' : 'average',
				'aboveAverage' : 'aboveAverage',
				'high' : 'high'
			},
			'returnRate' : {
				'equity' : 15,
				'debt' : 8,
				'liquid' : 6
			},
			'assetAllocationCategory' : {
				'OnlyEquity' : 'OnlyEquity',
				'OnlyDebt' : 'OnlyDebt',
				'A' : 'A',
				'B' : 'B',
				'C' : 'C',
				'D' : 'D',
				'E' : 'E'
			},
			'riskProfileToAssetAllocationCategory' : {
				'low' : 'A',
				'belowAverage' : 'B',
				'average' : 'C',
				'aboveAverage' : 'D',
				'high' : 'E'
			},
			'estimateType' : {
				'BUDGET' : 'budget',
				'COMFORTABLE': 'comfortable',
				'LUXURY' : 'luxury'
			},

			'otherGoals' : ['invest','tax','liquid'],
			'financialGoals' : ['retirement','education','property','automobile','vacation','wedding','event','jewellery'],
			'QUICKINVEST_LUMPSUM_TERM' : 10,
			'TAX_TERM' : 3,
			'LIQUID_LUMPSUM_TERM' : 3,
			'TAX_DEFAULT_ALLOCATION' : {'equity' : 0, 'debt' : 0, 'elss' : 100, 'liquid' : 0},
			'QUICK_TIP_EQUIDEBT' : [{
				'tip' : '<strong>Equity mutual funds:</strong> are those that invest in equities / stocks. They typically deliver higher returns over the long term (projected at 15% annualized, ideally for investment duration > 5 years), but they are riskier and can fluctuate in the short term.'
			},
			{'tip' : '<strong>Debt mutual funds:</strong> are those that generate steady Income from investing in instruments such as Corporate bonds, Government Bonds, Treasury Bills, etc. These are less risky and typically generate 6-10% returns depending on the time horizon of investment, security tenure and relative risk.' },
			{'tip' : '<Strong>Equity / Debt Mix:</strong> is the split of total investments between Equity and Debt instruments. We recommend the right mix for you based on your risk assessment and horizon of investment. However, you can modify this if you prefer a higher / lower risk portfolio, and the graph of ‘Projected Investment Growth’ would show you how your expected returns would change based on this.'}
			],
			'QUICK_TIP_ProjInvGrow' : [{
				'tip' : '<strong>Explanation of Growth estimates:</strong><ul><li>All future projections are based on historic returns and cannot be guaranteed.</li><li>Equity fund returns projected at 15.0% annualized.</li><li>Debt fund returns projected at 8.0% annualized.</li><li>All projections are annual, compounded monthly.</li></ul>'
			},
			{'tip' : '<strong>Disclaimer</strong><ul><li>Mutual fund investments are subject to market risks. Please read the offer documents carefully before investing.</li></ul>'}
			]
		});
})();