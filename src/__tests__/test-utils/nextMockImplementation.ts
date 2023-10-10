// Capture and mock the next's router implementation
const useRouter = jest.spyOn(require('next/router'), 'useRouter');

/**
 * Default properties of mocked useRouter implementation.
 */
const useRouterDefaultValues = {
  route: '/',
  pathname: '/',
  asPath: '/',
  query: {},
  locale: 'en',
  events: {
    emit: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
  },
  push: jest.fn(() => Promise.resolve(true)),
  prefetch: jest.fn(() => Promise.resolve(true)),
  replace: jest.fn(() => Promise.resolve(true)),
};

/**
 * Implementation of the mocked useRouter function.
 */
export const mockNextUseRouter = (values = { events: {} }) => {
  // Merge the events (nested field).
  let events = useRouterDefaultValues.events;
  if (values.events) {
    events = { ...events, ...values.events };
  }

  // Merge the top level fields.
  const mergedValues = { ...useRouterDefaultValues, ...values };

  // Overwrite the nested value with merged values
  mergedValues.events = events;

  useRouter.mockImplementation(() => ({ ...mergedValues }));
};
