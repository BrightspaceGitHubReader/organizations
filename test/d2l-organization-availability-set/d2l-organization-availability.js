import { Organizations, OrgUnitAvailability } from './data.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';

window.D2L.Siren.WhitelistBehavior._testMode(true);

describe('d2l-organization-availability', () => {
	let sandbox;
	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		sandbox.stub(window.d2lfetch, 'fetch', (input) => {
			const whatToFetch = {
				'/orgUnitAvailability2.json': OrgUnitAvailability.explicit,
				'/orgUnitAvailability3.json': OrgUnitAvailability.inherit,
				'/orgUnitAvailability4.json': OrgUnitAvailability.inheritWithDescendentType,
				'/organization6606.json': Organizations.Org6606,
				'/organization6609.json': Organizations.Org6609,
				'/organization121147.json': Organizations.Org121147
			};
			return Promise.resolve({
				ok: true,
				json: () => { return Promise.resolve(whatToFetch[input]); }
			});
		});
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('explicit entity', () => {
		let component;
		before(() => {
			component = fixture('org-availability');
			component.href = '/orgUnitAvailability2.json';
		});

		it('renders organization availability set', (done) => {
			afterNextRender(component, () => {
				expect(component._name).to.equal('Course');
				done();
			});
		});
	});

	describe('inherit entity', () => {
		let component;
		before(() => {
			component = fixture('org-availability');
			component.href = '/orgUnitAvailability3.json';
		});

		it('renders organization availability set', (done) => {
			afterNextRender(component, () => {
				expect(component._name).to.equal('Accounting&Financial Management');
				done();
			});
		});
	});

	describe('inherit with descendent type entity', () => {
		let component;
		before(() => {
			component = fixture('org-availability');
			component.href = '/orgUnitAvailability4.json';
		});

		it('renders organization availability set', (done) => {
			afterNextRender(component, () => {
				expect(component._name).to.equal('Accounting&Financial Management');
				done();
			});
		});
	});

	describe('_renderItemDescription', () => {
		let component;
		before(() => {
			component = fixture('org-availability');
		});

		it('handles explicit entity correctly', (done) => {
			const entity = {
				getCurrentTypeName: () => 'Course Offering',
				isExplicitAvailability: () => true
			};
			setTimeout(() => {
				const actualValue = component._renderItemDescription(entity, 'D2L Security');
				expect(actualValue).to.equal('The Course Offering: D2L Security');
				done();
			}, 200);
		});

		it('handles inherit entity correctly', (done) => {
			const entity = {
				getCurrentTypeName: () => 'Department',
				isExplicitAvailability: () => false,
				isInheritAvailability: () => true,
				getDescendentTypeName: () => ''
			};
			setTimeout(() => {
				const actualValue = component._renderItemDescription(entity, 'Smart People');
				expect(actualValue).to.equal('Every Org Unit under the Department: Smart People');
				done();
			}, 200);
		});

		it('handles inherit with descedent type entity correctly', (done) => {
			const entity = {
				getCurrentTypeName: () => 'Organization',
				isExplicitAvailability: () => false,
				isInheritAvailability: () => true,
				getDescendentTypeName: () => 'Program'
			};
			setTimeout(() => {
				const actualValue = component._renderItemDescription(entity, 'D2L');
				expect(actualValue).to.equal('Every Program under the Organization: D2L');
				done();
			}, 200);
		});
	});
});