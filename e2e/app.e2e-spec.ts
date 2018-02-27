import { UptrackerPage } from './app.po';

describe('uptracker App', () => {
  let page: UptrackerPage;

  beforeEach(() => {
    page = new UptrackerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
