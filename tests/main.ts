import Tokenizer from '../src/main';

describe('tokenizer', () => {
  it('Should has a Tokenizer class', () => {
    expect(Tokenizer).toBeDefined();
  });

  it('Should the instance returns valid API_KEY property', () => {
    const instance = new Tokenizer('45b960805ced5c27ce34b1600b4b9f54');
    expect(instance).toHaveProperty('API_KEY', '45b960805ced5c27ce34b1600b4b9f54');
  });

  it('Should receive a payload', async () => {
    const tokenizer = new Tokenizer('45b960805ced5c27ce34b1600b4b9f54');

    return expect(
      tokenizer.init([
        {
          type: 'name',
          value: 'Fulano de tal'
        },
        {
          type: 'email',
          value: 'test@test.com'
        },
        {
          type: 'number',
          value: '4575623182290326'
        },
        {
          type: 'cvc',
          value: '123'
        },
        {
          type: 'date_exp',
          value: '07' + '/' + '2017'
        }
      ])
    ).resolves.toHaveProperty('status', 'success')
  });

  it('Should throw an error when the payload has wrong format', async () => {
    const tokenizer = new Tokenizer('45b960805ced5c27ce34b1600b4b9f54');
    return expect(tokenizer.init([])).rejects.toEqual(new Error('Error inesperado'));
  });
});
