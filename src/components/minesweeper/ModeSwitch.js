import React from "react";
import "./ModeSwitch.css";
import Form from "react-bootstrap/Form";

function ModeSwitch({ isMarkMode, onChange }) {
  return (
    <div className="mode-switch">
      <span className="ms-icon">🏴</span>
      <Form>
        <Form.Check
          type="switch"
          id="custom-switch"
          label=""
          defaultChecked={isMarkMode}
          onChange={onChange}
        />
      </Form>
    </div>
  );
}

export default ModeSwitch;
