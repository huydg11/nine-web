import React from "react";

const PatchHistory = ({ patch_history }) => {

  return (
    <div id="patch-history-wrapper">
      {Object.entries(patch_history)
        .reverse() // Reverse the order of the entries
        .map(([key, { version, detail }]) => (
          <div key={key}>
            <p className="patch-history-button-wrapper">
              <button
                className="btn btn-primary"
                type="button"
                data-toggle="collapse"
                data-target={`#${key}`}
                aria-expanded="false"
                aria-controls={key}
              >
                {version}
              </button>
            </p>
            <div className="collapse" id={key}>
              <div
                className="card-history card-body"
                dangerouslySetInnerHTML={{ __html: detail }}
              />
            </div>
          </div>
        ))}
    </div>
  );
};

export default PatchHistory;
