
import React from 'react';

// This component only renders the static container markup for Open Roles.
// The actual roles list is injected by JS (homeInit.js) at runtime.
const OpenRoles = () => (
  <section id="open-roles" className="open-roles">
    <div className="open-roles-wrapper">
      <div className="top">
        <div className="title"><span>Open Roles</span></div>
        <div className="info"><span>Minus sapiente suscipit incidunt ut error quo vel eum rem.</span></div>
      </div>
      <div className="roles-container">
        <div className="role-tops">
          <div className="c1"><span>Role</span></div>
          <div className="c2"> </div>
          <div className="c3"><span>Positions</span></div>
          <div className="c4"><span>ApplyNow</span></div>
        </div>
        {/* JS will inject the roles into this container */}
        <div className="roles-scroll"></div>
      </div>
    </div>
  </section>
);

export default OpenRoles;
