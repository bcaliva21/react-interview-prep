import React, { useState } from 'react'
import './styles.css'


const HTML_CONTENT = `
  The HyperText Markup Language or HTML is the standard markup language
  for documents designed to be displayed in a web browser.
`;
const CSS_CONTENT = `
  Cascading Style Sheets is a style sheet language used for describing
  the presentation of a document written in a markup language such as
  HTML or XML.
`;

const JAVASCRIPT_CONTENT = `
  JavaScript, often abbreviated as JS, is a programming language that is
  one of the core technologies of the World Wide Web, alongside HTML and
  CSS.
`;

function Accordion() {
  return (
    <div>
      <h1>Title</h1>
      <div className="sections">
        <Section content={HTML_CONTENT} title={"HTML"} />
        <Section content={CSS_CONTENT} title={"CSS"} />
        <Section content={JAVASCRIPT_CONTENT} title={"JavaScript"} />
      </div>
    </div>
  );
}

function Section({ content, title }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div>
      <button
        className="section-title"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2>
          {title}{" "}
          <span
            aria-hidden={true}
            className={
              isExpanded ? "accordion-icon--rotated" : "accordion-icon"
            }
          />
        </h2>
      </button>
      {isExpanded && <div>{content}</div>}
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <Accordion />
  )
}

export default App
