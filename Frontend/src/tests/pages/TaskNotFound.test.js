import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route } from "react-router-dom";
import TaskNotFound from "../../pages/TaskNotFound";

test('Have a check at redirect after "Add a task" button clicked', () => {
  let testHistory, testLocation;
  render(
    <MemoryRouter initialEntries={["/PathToError"]}>
      <TaskNotFound message='testing' />
      <Route
        path='*'
        render={({ history, location }) => {
          testHistory = history;
          testLocation = location;
          return null;
        }}
      ></Route>
    </MemoryRouter>
  );

  const saveBtnElement = screen.getByText("Add a task", { exact: false });
  userEvent.click(saveBtnElement);

  expect(testLocation.pathname).toEqual("/todolist/add");
});
