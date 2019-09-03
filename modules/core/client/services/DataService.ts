'use strict';

import angular from 'angular';

export interface IDataService {
	acceptedCurrencies: any[];
	cities: string[];
}

angular.module('core').service('DataService', () => {
	return {
		cities: [
			'Victoria',
			'Vancouver',
			'100 Mile House',
			'Abbotsford',
			'Armstrong',
			'Barriere',
			'Burnaby',
			'Campbell River',
			'Castlegar',
			'Central Saanich',
			'Chetwynd',
			'Chilliwack',
			'Clearwater',
			'Coldstream',
			'Colwood',
			'Comox',
			'Coquitlam',
			'Courtenay',
			'Cranbrook',
			'Creston',
			'Dawson Creek',
			'Delta',
			'Duncan',
			'Elkford',
			'Enderby',
			'Esquimalt',
			'Fernie',
			'Fort St. James',
			'Fort St. John',
			'Grand Forks',
			'Greenwood',
			'Highlands',
			'Hope',
			'Houston',
			"Hudson's Hope",
			'Invermere',
			'Kamloops',
			'Kelowna',
			'Kent',
			'Kimberley',
			'Kitimat',
			'Ladysmith',
			'Lake Country',
			'Langford',
			'Langley',
			'Langley',
			'Lantzville',
			'Lillooet',
			'Logan Lake',
			'Mackenzie',
			'Maple Ridge',
			'Merritt',
			'Metchosin',
			'Mission',
			'Nanaimo',
			'Nelson',
			'New Hazelton',
			'New Westminster',
			'North Cowichan',
			'North Saanich',
			'North Vancouver',
			'North Vancouver',
			'Northern Rockies',
			'Oak Bay',
			'Parksville',
			'Peachland',
			'Penticton',
			'Pitt Meadows',
			'Port Alberni',
			'Port Coquitlam',
			'Port Edward',
			'Port Hardy',
			'Port Moody',
			'Powell River',
			'Prince George',
			'Prince Rupert',
			'Qualicum Beach',
			'Quesnel',
			'Revelstoke',
			'Richmond',
			'Rossland',
			'Saanich',
			'Salmon Arm',
			'Sechelt',
			'Sicamous',
			'Sidney',
			'Smithers',
			'Sooke',
			'Spallumcheen',
			'Sparwood',
			'Squamish',
			'Stewart',
			'Summerland',
			'Surrey',
			'Taylor',
			'Terrace',
			'Tofino',
			'Trail',
			'Tumbler Ridge',
			'Ucluelet',
			'Vanderhoof',
			'Vernon',
			'View Royal',
			'Wells',
			'West Kelowna',
			'West Vancouver',
			'White Rock',
			'Williams Lake'
		],
		acceptedCurrencies: [
			{code: 'USD', symbol: '&#36;'},
			{code: 'EUR', symbol: '&euro;'},
			{code: 'JPY', symbol: '&#165;'},
			{code: 'GBP', symbol: '&#163;'},
			{code: 'AUD', symbol: '&#163;'},
			{code: 'CAN', symbol: '&#36;'},
			{code: 'CHF', symbol: '&nbsp;'},
			{code: 'CNY', symbol: '&#165;'},
			{code: 'SEK', symbol: '&#107;&#114;'},
			{code: 'MXN', symbol: '&#36;'},
			{code: 'NZD', symbol: '&#36;'},
			{code: 'SGD', symbol: '&#36;'},
			{code: 'HKD', symbol: '&#36;'},
			{code: 'NOK', symbol: '&#107;&#114;'},
			{code: 'KRW', symbol: '&#8361;'},
			{code: 'TRY', symbol: '&#8378;'},
			{code: 'INR', symbol: '&#8377;'},
			{code: 'RUB', symbol: '&#1088;&#1091;&#1073;'},
			{code: 'BRL', symbol: '&#82;&#36;'},
			{code: 'ZAR', symbol: '&#82;'}
		]
	} as IDataService;
});
