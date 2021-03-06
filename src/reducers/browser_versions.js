import {
  GET_BROWSER_VERSIONS_SUCCESS,
  ADD_BROWSER_VERSION_SUCCESS,
  REMOVE_BROWSER_VERSIONS_SUCCESS,
  GET_BROWSER_VERSION_PRIORITIES_SUCCESS,
  SET_BROWSER_VERSION_PRIORITY_SUCCESS
} from "../constants/browser_versions";
import {
  filterById,
  sortById,
  sortDescById,
  defaultToEmptyArray,
  mapById
} from "../utils/ramda";

const initialState = {
  entities: [],
  priorities: {},
  fetchStatus: false
};

export default function browserVersionState(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_BROWSER_VERSIONS_SUCCESS: {
      return {
        ...state,
        entities: sortById(payload),
        fetchStatus: true
      };
    }

    case ADD_BROWSER_VERSION_SUCCESS: {
      return {
        ...state,
        entities: sortById([...state.entities, payload])
      };
    }

    case REMOVE_BROWSER_VERSIONS_SUCCESS: {
      return filterById(payload, state);
    }

    case GET_BROWSER_VERSION_PRIORITIES_SUCCESS: {
      return {
        ...state,
        priorities: { ...state.priorities, ...payload }
      };
    }

    case SET_BROWSER_VERSION_PRIORITY_SUCCESS: {
      const prs = state.priorities[payload.profile_name].filter(
        elm => elm.id !== payload.priority.id
      );

      return {
        ...state,
        priorities: {
          ...state.priorities,
          [payload.profile_name]: sortById([...prs, payload.priority])
        }
      };
    }

    default: {
      return state;
    }
  }
}

export function getBrowserVersions(state) {
  return state.browser_versions.entities;
}

export function getBrowserVersionById(state) {
  const items = getBrowserVersions(state);
  return id => {
    const isEqual = elm => elm.id === id;
    return items.find(isEqual);
  };
}

export function getBrowserVersionByBrowserId(state) {
  const items = getBrowserVersions(state);
  return id => {
    return sortById(items.filter(elm => elm.browser_id === id));
  };
}

export function getBrowserVersionPriorities(state, profile) {
  const priorities = defaultToEmptyArray(
    state.browser_versions.priorities[profile]
  );
  const browser_versions = getBrowserVersions(state);
  return mapById(priorities, browser_versions);
}
