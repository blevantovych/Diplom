import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "mobx-react";
import main from "./stores/main";
import loader from "./stores/loader";
import { renderToStaticMarkup } from "react-dom/server";
import globalTranslations from "./translations/global.js";
import Routes from "./routes";
import { LocalizeProvider, withLocalize } from "react-localize-redux";
// import { withLocalize } from "react-localize-redux";

console.log(globalTranslations);

const Main = withLocalize(
  class Main extends React.Component {
    constructor(props) {
      super(props);

      this.props.initialize({
        languages: [
          { name: "English", code: "en" },
          { name: "Ukrainian", code: "ua" }
        ],
        translation: globalTranslations,
        options: { renderToStaticMarkup }
      });
    }

    render() {
      return this.props.children;
    }
  }
);

const app = document.getElementById("app");
ReactDOM.render(
  <Provider main={main} loader={loader}>
    <LocalizeProvider>
      <Main>
        <Routes />
      </Main>
    </LocalizeProvider>
  </Provider>,
  app
);
