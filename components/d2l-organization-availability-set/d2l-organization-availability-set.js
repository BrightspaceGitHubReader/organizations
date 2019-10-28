import { LitElement, css, html } from 'lit-element/lit-element';
import { EntityMixinLit } from 'siren-sdk/src/mixin/entity-mixin-lit.js';
import { OrganizationAvailabilitySetEntity } from 'siren-sdk/src/organizations/OrganizationAvailabilitySetEntity.js';
import { LocalizeMixin } from '@brightspace-ui/core/mixins/localize-mixin.js';
import '@brightspace-ui/core/components/button/button';

import { getLocalizeResources } from './localization.js';
import './d2l-organization-availability.js';
import './d2l-current-organization-availability.js';

class OrganizationAvailabilitySet extends EntityMixinLit(LocalizeMixin(LitElement)) {

	static get properties() {
		return {
			_availabilityEntities: { type: Array },
			_currentOrgUnitEntity: { type: Object },
			_canAddAvailability: { type: Boolean },
			_currentOrgUnitName: { type: String }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	static async getLocalizeResources(langs) {
		return getLocalizeResources(langs);
	}

	constructor() {
		super();
		this._availabilityEntities = [];
		this._setEntityType(OrganizationAvailabilitySetEntity);
		if (D2L.Dialog && D2L.Dialog.OrgUnitSelector) {
			this._dialog = new D2L.Dialog.OrgUnitSelector(this.handleOrgUnitSelect);
		}
	}

	set _entity(entity) {
		if (this._entityHasChanged(entity)) {
			super._entity = entity;
			this._onAvailabilitySetChange(entity);
		}
	}

	_onAvailabilitySetChange(entity) {
		if (entity) {
			this._availabilityEntities = entity.getEntitiesExcludingCurrentOrgUnit();
			this._canAddAvailability = entity.canAddAvailability();
			this._currentOrgUnitEntity = entity.getCurrentOrgUnitEntity();
			entity.onOrganizationChange(organization => {
				this._currentOrgUnitName = organization.name();
			});
		}
	}

	render() {
		return html`
			${this._currentOrgUnitEntity ?
				html`
					<d2l-current-organization-availability
						.href="${this._currentOrgUnitEntity.href}"
						.token="${this.token}">
					</d2l-organization-availability>
				` :
				html`
					<d2l-input-checkbox ?disabled="${!this._canAddAvailability}">
						${this.localize('currentOrgUnitItemDescription', { name: this._currentOrgUnitName })}
					</d2l-input-checkbox>
				`
			}
			${this._canAddAvailability ?
				html`<d2l-button @click=${this.handleAddOrgUnits}>Add Org Units</d2l-button>` : ''
			}
			${this._availabilityEntities.map(entity =>
				html`
					<d2l-organization-availability
						.href="${entity.href}"
						.token="${this.token}">
					</d2l-organization-availability>
				`
			)}
		`;
	}

	handleOrgUnitSelect() {
	}

	handleAddOrgUnits() {
		if (this._dialog.Open) {
			this._dialog.Open();
		}
	}
};

customElements.define('d2l-organization-availability-set', OrganizationAvailabilitySet);
