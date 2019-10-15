'use strict';

import {dedupingMixin} from '@polymer/polymer/lib/utils/mixin.js';

/* @polymerMixin */
const LangTrImpl = (superClass) => class extends superClass {
	constructor() {
		super();
		this.tr = {
			'errorFull': 'Oops! We were unable to fetch information for {num} of your tabs. Try refreshing the page',
			'errorShort': 'Oops',
			'loading': 'Yükleniyor',
			'newNotifications': '{name} - Yeni uyarılarınız var'
		};
	}
};

export const LangTr = dedupingMixin(LangTrImpl);
