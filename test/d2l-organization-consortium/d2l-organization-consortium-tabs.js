import {organization1, organization2, root1, root2, alerts1, alerts2, consortium} from './data.js';

describe('d2l-organization-consortium-tabs', () => {
	var sandbox;
	beforeEach(() => {
		sandbox = sinon.sandbox.create();
	});

	afterEach(() => {
		sandbox.restore();
		window.D2L.Siren.EntityStore.clear();
	});

	describe('With proper fetch', () => {
		beforeEach(() => {
			sandbox.stub(window.d2lfetch, 'fetch', (input) => {
				const whatToFetch = {
					'../data/consortium/organization1-consortium.json': organization1,
					'../data/consortium/organization2-consortium.json': organization2,
					'../data/consortium/root1-consortium.json': root1,
					'../data/consortium/root2-consortium.json': root2,
					'../data/alerts-has-unread.json': alerts1,
					'../data/alerts-no-unread.json': alerts2,
					'/consortium.json': consortium,
				};
				return Promise.resolve({
					ok: true,
					json: () => { return Promise.resolve(whatToFetch[input]); }
				});
			});
		});

		it('populates data correctly', (done) => {
			const component = fixture('org-consortium');
			component.href = '/consortium.json';

			flush(function() {
				const tabs = component.shadowRoot.querySelectorAll('a');
				assert.equal(tabs.length, 2, 'should have 2 tabs');
				assert.equal(tabs[0].text, 'c1');
				assert.equal(tabs[1].text, 'Consortium 2');
				assert.include(tabs[0].href, '?consortium=1');
				assert.include(tabs[1].href, '?consortium=2');

				const dots = component.shadowRoot.querySelectorAll('d2l-navigation-notification-icon');
				assert.equal(dots.length, 2);
				assert.isFalse(dots[0].hasAttribute("hidden"));
				assert.isTrue(dots[1].hasAttribute("hidden"));
				done();
			});
		});

		it('alerts use correct token', (done) => {
			const component = fixture('org-consortium');
			component.href = '/consortium.json';

			flush(function() {
				const alerts = component._alertTokensMap;
				assert.equal(alerts['../data/alerts-has-unread.json'], 'token1');
				assert.equal(alerts['../data/alerts-no-unread.json'], 'token2');
				done();
			});
		});
	});

	describe('Do not fetch alert entities', () => {
		beforeEach(() => {
			sandbox.stub(window.d2lfetch, 'fetch', (input) => {
				const whatToFetch = {
					'../data/consortium/organization1-consortium.json': organization1,
					'../data/consortium/organization2-consortium.json': organization2,
					'../data/consortium/root1-consortium.json': root1,
					'../data/consortium/root2-consortium.json': root2,
					'../data/alerts-has-unread.json': null,
					'../data/alerts-no-unread.json': null,
					'/consortium.json': consortium,
				};
				return Promise.resolve({
					ok: !!whatToFetch[input],
					json: () => { return Promise.resolve(whatToFetch[input]); }
				});
			});
		});

		it('org tabs should render with no dots when alerts entities are null', (done) => {
			const component = fixture('org-consortium');
			component.href = '/consortium.json';

			flush(function() {
				const tabs = component.shadowRoot.querySelectorAll('a');
				assert.equal(tabs.length, 2, 'should have 2 tabs');
				assert.equal(tabs[0].text, 'c1');
				assert.equal(tabs[1].text, 'Consortium 2');
				assert.include(tabs[0].href, '?consortium=1');
				assert.include(tabs[1].href, '?consortium=2');

				const dots = component.shadowRoot.querySelectorAll('d2l-navigation-notification-icon');
				assert.equal(dots.length, 2);
				assert.isTrue(dots[0].hasAttribute("hidden"));
				assert.isTrue(dots[1].hasAttribute("hidden"));
				done();
			});
		});
	});

});
