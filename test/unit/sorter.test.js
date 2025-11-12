
const { countingWordsSorter } = require('../../src/model/countingWordsSorter.js');

test('it should learn to sort simple messages', () => {

  const sorter = new countingWordsSorter(); 

  const messages = [['win', 'prize'], ['free', 'money'], ['call', 'later'], ['hello', 'dad']];
  const labels = ['spam', 'spam', 'ham', 'ham'];

  sorter.learn(messages, labels);

  expect(sorter.guess(['free', 'prize'])).toBe('spam');
  expect(sorter.guess(['call', 'dad'])).toBe('ham');
});