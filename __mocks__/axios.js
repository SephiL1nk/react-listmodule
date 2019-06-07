const mockAxios = {
  get: jest.fn(() => Promise.resolve({ data: {} }))
}

module.exports = mockAxios