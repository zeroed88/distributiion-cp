import React from "react";
import Card from "../components/Card";
import urls from "../urls";
import { withRouter } from "react-router";

const items = [
  {
    title: "Киборги",
    text: "Список киборгов профиля",
    to: "#",
    image: "al-cyborg"
  },
  {
    title: "Окружение",
    text: "Управление распределением параметров окружения",
    to: "distribution",
    image: "al-distribution"
  },
  {
    title: "Cookies",
    text: "Управление cookies",
    to: "#",
    image: "al-cookies"
  },
  {
    title: "Интересы",
    text: "Управление кругом интересов (тематика)",
    to: "#",
    image: "al-star"
  }
];

const ProfilePage = props => {
  const cards = items.map((elm, index) => (
    <Card key={index} {...elm} to={`${props.match.url}/${elm.to}`} />
  ));

  return (
    <div className="main-content start">
      <div className="cards">
        {cards}
      </div>
    </div>
  );
};

export default withRouter(ProfilePage);