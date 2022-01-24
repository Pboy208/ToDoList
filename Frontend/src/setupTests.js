import "@testing-library/jest-dom";
import mockData from "../public/locales/en/translation.json";

export const mockHistoryPush = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({
    pathname: "/todolist",
  }),
  useParams: () => ({
    taskId: 1,
  }),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: () => ({ message: "message", token: { token: "token" } }),
}));

export const mockDispatch = jest.fn();
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => mockDispatch,
}));

jest.mock("react-i18next", () => ({
  ...jest.requireActual("react-i18next"),
  useTranslation: () => [
    (string) => {
      switch (string) {
        case "field-title.name":
          return "Name";
        case "field-title.status":
          return "Status";
        case "field-title.priority":
          return "Priority";
        case "task-form.cancel-btn":
          return "CANCEL";
        case "task-form.save-btn":
          return "SAVE";
        case "delete.message":
          return "Do you want to delete this item";
        case "delete.cancel-btn":
          return "CANCEL";
        case "delete.delete-btn":
          return "DELETE";
        default:
          return mockData[string];
      }
    },
    { changeLanguage: jest.fn() },
  ],
}));
