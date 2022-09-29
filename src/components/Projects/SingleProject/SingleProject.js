import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FaPlay, FaCode } from "react-icons/fa";
import Fade from "react-reveal/Fade";

import placeholder from "../../../assets/png/placeholder.png";
import "./SingleProject.css";
import { skillsImage } from "../../../utils/skillsImage";

function SingleProject({
  id,
  name,
  projectHade,
  desc,
  tags,
  code,
  demo,
  image,
  theme,
}) {
  const useStyles = makeStyles((t) => ({
    iconBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 40,
      height: 40,
      borderRadius: 50,
      border: `2px solid ${theme.tertiary}`,
      color: theme.tertiary,
      transition: "all 0.2s",
      "&:hover": {
        backgroundColor: theme.secondary,
        color: theme.primary,
        transform: "scale(1.1)",
        border: `2px solid ${theme.secondary}`,
      },
    },
    icon: {
      fontSize: "1.1rem",
      transition: "all 0.2s",
      "&:hover": {},
    },
  }));

  const classes = useStyles();

  return (
    <Fade bottom>
      <div
        key={id}
        className="singleProject"
        style={{ backgroundColor: theme.primary400 }}
      >
        <h2
          id={name.replace(" ", "-").toLowerCase()}
          style={{ color: theme.tertiary, fontFamily: "cursive" }}
        >
          {name}
        </h2>
        <div className="ProjectMiddle">
          <div>
            <div className="projectContent">
              <img src={image ? image : placeholder} alt={name} />
            </div>
            <p
              className="project--desc"
              style={{ fontSize: "15px", fontWeight: "500" }}
            >
              {projectHade}
            </p>
          </div>
          <div>
            <p
              className="project--desc"
              style={{
                fontSize: "20px",
                fontWeight: "600",
                marginTop: "-10px",
                textAlign: "center",
                fontFamily: "cursive",
              }}
            >
              Feature
            </p>
            <ul className="project--desc">
              {desc.map((e) => (
                <li>{e}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="project--lang">
          {tags.map((tag, id) => (
            <img key={id} src={skillsImage(tag)} alt={tag} />
          ))}
        </div>
        <div className="project--showcaseBtn">
          <a
            href={demo}
            target="_blank"
            rel="noreferrer"
            className={classes.iconBtn}
            aria-labelledby={`${name.replace(" ", "-").toLowerCase()} ${name
              .replace(" ", "-")
              .toLowerCase()}-demo`}
          >
            <FaPlay
              id={`${name.replace(" ", "-").toLowerCase()}-demo`}
              className={classes.icon}
              aria-label="Demo"
            />
          </a>
          <a
            href={code}
            target="_blank"
            rel="noreferrer"
            className={classes.iconBtn}
            aria-labelledby={`${name.replace(" ", "-").toLowerCase()} ${name
              .replace(" ", "-")
              .toLowerCase()}-code`}
          >
            <FaCode
              id={`${name.replace(" ", "-").toLowerCase()}-code`}
              className={classes.icon}
              aria-label="Code"
            />
          </a>
        </div>
      </div>
    </Fade>
  );
}

export default SingleProject;
