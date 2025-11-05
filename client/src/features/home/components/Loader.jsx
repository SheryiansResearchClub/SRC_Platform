import React, { useEffect, useRef } from "react";
import OdometerLite from "../../../libs/Odometer";
import "../../../libs/Odometer.css";

const Loader = ({ startRef, targetRef }) => {
  const loaderRef = useRef(null);
  const odometerRef = useRef(null);
  const odometerInstance = useRef(null);

  useEffect(() => {
    if (odometerRef.current && !odometerInstance.current) {
      odometerInstance.current = new OdometerLite(odometerRef.current, {
        duration: 2500,
        digits: 3,
        maxValue: 100,
      });
      setTimeout(() => {
        odometerInstance.current.setValue(100);
      }, 100);
    }
  }, []);

  return (
    <div className="loader" ref={loaderRef}>
      <div className="words-wrapper">
        <div className="words">
          <span className="word">private flex</span>
          <span className="word">invite-only club</span>
          <span className="word">main character vibe</span>
          <span className="word">let’s win hackathons</span>
          <span className="word">catch us in godmode</span>
          <span className="word">they prep for 2nd place</span>
          <span className="word">we touch grass after a win</span>
          <span className="word">open source flex</span>
          <span className="word">git push, no cringe</span>
          <span className="word">doing cool stuff</span>
          <span className="word">low effort, high impact</span>
          <span className="word">we’re new sexy</span>
          <span className="word">private flex</span>
        </div>
      </div>
      <div className=" progress-meter odometer odometer-theme-minimal">
        <div className="odometer-inside">
          <span className="odometer-digit">
            <span className="odometer-digit-spacer">8</span>
            <span className="odometer-digit-inner">
              <span className="odometer-ribbon">
                <span className="odometer-ribbon-inner">
                  <span className="odometer-value">0</span>
                </span>
              </span>
            </span>
          </span>
          <span className="odometer-digit">
            <span className="odometer-digit-spacer">8</span>
            <span className="odometer-digit-inner">
              <span className="odometer-ribbon">
                <span className="odometer-ribbon-inner">
                  <span className="odometer-value"></span>
                  <span className="odometer-value">0</span>
                </span>
              </span>
            </span>
          </span>
          <span className="odometer-digit">
            <span className="odometer-digit-spacer">8</span>
            <span className="odometer-digit-inner">
              <span className="odometer-ribbon">
                <span className="odometer-ribbon-inner">
                  <span className="odometer-value"></span>
                  <span className="odometer-value">0</span>
                </span>
              </span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
