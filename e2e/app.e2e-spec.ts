import { OmrChatPage } from './app.po';

describe('omr-chat App', () => {
  let page: OmrChatPage;

  beforeEach(() => {
    page = new OmrChatPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
