'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangNlImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.nl = {
			'errorFull': 'Oops! We were unable to fetch information for {num} of your tabs. Try refreshing the page',
			'errorShort': 'Oops',
			'loading': 'Laden',
			'newNotifications': '{name} - U hebt nieuwe waarschuwingen'
		};
	}
};

export const LangNl = dedupingMixin(LangNlImpl);
