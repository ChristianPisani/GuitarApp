export const Header = () => {
  return (
    <div
      style={{
        width: 1728,
        height: 84,
        position: "relative",
        background: "#AF5B11",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      }}
    >
      <div
        style={{
          width: 459.35,
          height: 33.86,
          left: 665,
          top: 29.65,
          position: "absolute",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 25,
          display: "inline-flex",
        }}
      >
        <div
          style={{
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 8,
            paddingBottom: 8,
            borderRadius: 50,
            border: "2px #FEF4EB solid",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 8,
            display: "flex",
          }}
        >
          <div
            style={{
              width: 25,
              height: 25,
              background: "#FEF4EB",
              border: "1px #FEF4EB solid",
            }}
          ></div>
          <div
            style={{
              color: "#FEF4EB",
              fontSize: 24,
              fontFamily: "Patua One",
              fontWeight: "400",
              wordWrap: "break-word",
            }}
          >
            Visualize
          </div>
        </div>
        <div
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 8,
            display: "flex",
          }}
        >
          <div style={{ width: 25, height: 25, background: "#FEF4EB" }}></div>
          <div
            style={{
              width: 82.94,
              height: 34,
              color: "#FEF4EB",
              fontSize: 24,
              fontFamily: "Patua One",
              fontWeight: "400",
              wordWrap: "break-word",
            }}
          >
            Learn
          </div>
        </div>
        <div
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 8,
            display: "flex",
          }}
        >
          <div
            style={{
              width: 25,
              height: 25,
              background: "#FEF4EB",
              border: "1px #FEF4EB solid",
            }}
          ></div>
          <div
            style={{
              width: 105.11,
              height: 34.26,
              color: "#FEF4EB",
              fontSize: 24,
              fontFamily: "Patua One",
              fontWeight: "400",
              wordWrap: "break-word",
            }}
          >
            Practice
          </div>
        </div>
      </div>
      <div
        style={{
          left: 291,
          top: 15.81,
          position: "absolute",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 8,
          display: "inline-flex",
        }}
      >
        <div style={{ width: 28, height: 30.64, background: "#FEF4EB" }}></div>
        <div
          style={{
            width: 198,
            height: 53.36,
            color: "#FEF4EB",
            fontSize: 32,
            fontFamily: "Patua One",
            fontWeight: "400",
            wordWrap: "break-word",
          }}
        >
          GUITARLY
        </div>
      </div>
    </div>
  );
};
