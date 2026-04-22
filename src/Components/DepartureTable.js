import { Row, Col, Modal } from "antd";
import React, { useState } from "react";
import Marquee from "react-fast-marquee";
import { getTranslation } from "../dictionary";
import RadarMap from "./RadarMap";
import useIsMobile from "../hooks/useIsMobile";
import { sanitizeDisplayText } from "../utils/displayText";

const DepartureTable = (props) => {
  const isMobile = useIsMobile();
  const FONTSIZE = props.fontSize;
  const FONTFAMILYNAME = "Roboto Condensed";
  const mobileFontSize = isMobile ? FONTSIZE * 0.85 : FONTSIZE;

  const styles = {
    columnName: {
      fontSize: mobileFontSize,
      fontFamily: FONTFAMILYNAME,
    },
    column: {
      color: "orange",
      fontSize: mobileFontSize,
      fontFamily: FONTFAMILYNAME,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: isMobile ? "nowrap" : "normal",
    },
    headerRowStation: {
      backgroundColor: "#000",
      color: "#fff",
      padding: isMobile ? "4px 8px" : "8px",
      position: "sticky",
      top: -8,
      zIndex: 6,
      fontFamily: FONTFAMILYNAME,
    },
    headerRowColumns: {
      backgroundColor: "#f5f5f5",
      padding: isMobile ? "4px 8px" : "8px",
      position: "sticky",
      top: isMobile ? 32 : 32,
      zIndex: 5,
      fontFamily: FONTFAMILYNAME,
    },
    columnNameClickable: {
      fontSize: mobileFontSize,
      fontFamily: FONTFAMILYNAME,
      cursor: "pointer",
      textDecoration: "underline",
    },
    groupHeader: {
      color: "orange",
      padding: "6px 8px",
      fontSize: mobileFontSize * 0.9,
      fontFamily: FONTFAMILYNAME,
      borderTop: "2px solid orange",
      marginTop: 8,
      marginBottom: 4,
      borderRadius: 4,
      background: "#222",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      cursor: "pointer",
    },
    dataRow: {
      borderBottom: "1px solid #333",
      alignItems: "center",
      minHeight: mobileFontSize * 2,
      fontFamily: FONTFAMILYNAME,
    },
    marquee: {
      color: "white",
      fontSize: mobileFontSize * 0.8,
      fontFamily: FONTFAMILYNAME,
      padding: "0 8px",
      background: "#222",
      borderRadius: 4,
      margin: "2px 0 8px 0",
    },
  };
  const [isPaused, setIsPaused] = useState(false);
  const [radarModalOpen, setRadarModalOpen] = useState(false);

  const sanitizeHTML = (html) => {
    const allowedTags = {
      a: {
        href: /^https?:\/\/.+/i,
        target: "_blank",
        rel: "noopener noreferrer",
        class: "remark-link",
      },
      b: {},
      i: {},
      em: {},
      strong: {},
    };

    return html.replace(
      /<(\/?)([a-z0-9]+)([^>]*?)>/gi,
      (match, closing, tag, attrs) => {
        tag = tag.toLowerCase();

        if (!allowedTags[tag]) {
          return "";
        }

        if (closing) {
          return `</${tag}>`;
        }

        if (tag === "a") {
          const hrefMatch = attrs.match(/href=["']([^"']+)["']/i);
          if (hrefMatch && allowedTags.a.href.test(hrefMatch[1])) {
            return `<a href="${hrefMatch[1]}" target="_blank" rel="noopener noreferrer" class="remark-link">`;
          }
          return "";
        }

        return `<${tag}>`;
      }
    );
  };

  const processRemarks = (remarks) => {
    if (!remarks?.length) return "";
    return remarks.map((remark) => remark.text).join(" *** ");
  };

  const getSortedData = () => {
    return props.dataSource.sort((a, b) => a.when - b.when);
  };

  return (
    <div
      style={{
        padding: isMobile ? "8px" : "16px",
        paddingTop: "0px",
        borderRadius: "8px",
      }}
    >
      <style>
        {`
          .remark-link, .remark-link:visited, .remark-link:hover, .remark-link:active {
            color: #FFA500 !important;
            text-decoration: underline !important;
            cursor: pointer;
          }
        `}
      </style>



      {/* Station name header (both views) */}
      {props.dataSource.length > 0 && (
        <Row style={styles.headerRowStation}>
          <Col
            style={{
              ...styles.columnName,
              textAlign: isMobile ? "left" : "center",
            }}
            span={24}
          >
            {sanitizeDisplayText(props.dataSource[0].departureName)}
          </Col>
        </Row>
      )}

      {/* Column headers (both views) */}
      <Row style={styles.headerRowColumns}>
        <Col style={styles.columnName} span={isMobile ? 4 : 4}>
          {getTranslation(props.language, "line")}
        </Col>
        <Col style={styles.columnName} span={isMobile ? 12 : 14}>
          {getTranslation(props.language, "destination")}
        </Col>
        <Col style={{ ...styles.columnName, textAlign: isMobile ? "right" : "left" }} span={isMobile ? 8 : 6}>
          {getTranslation(props.language, "departure")}
        </Col>
      </Row>

      {/* Mobile: Abfahrten anzeigen */}
      {isMobile && getSortedData().map((data) => {
        const remarkText = processRemarks(data.remarks);
        // Ersetze '->' durch '>' im Zieltext
        const directionText = sanitizeDisplayText(data.direction || "").replace(/->/g, ">");
        return (
          <div
            key={data.key}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Row style={styles.dataRow}>
              <Col style={styles.column} span={4}>
                {data.lineName}
              </Col>
              <Col style={styles.column} span={12}>
                {directionText}
              </Col>
              <Col style={{ ...styles.column, textAlign: "right" }} span={8}>
                {data.when == null
                  ? getTranslation(props.language, "cancelled")
                  : (() => {
                      let timeString = "";
                      if (data.departureTime) {
                        const date = new Date(data.departureTime);
                        timeString = date.toLocaleTimeString(props.language === "de" ? "de-DE" : "en-GB", { hour: "2-digit", minute: "2-digit" });
                      }
                      if (data.when > 0) {
                        return `${timeString} | ${data.when} ${getTranslation(props.language, "minutes")}`;
                      } else {
                        return `${timeString} | ${getTranslation(props.language, "now")}`;
                      }
                    })()
                }
              </Col>
            </Row>
            {remarkText && props.remarksVisibility && (
              <Marquee
                speed={30}
                play={!isPaused}
                style={styles.marquee}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <span
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(remarkText) }}
                  onClick={(e) =>
                    e.target.tagName === "A" && e.stopPropagation()
                  }
                />
              </Marquee>
            )}
          </div>
        );
      })}

      {/* Desktop: Regular view */}
      {!isMobile && getSortedData().map((data) => {
        const remarkText = processRemarks(data.remarks);
        // Ersetze '->' durch '>' im Zieltext
        const directionText = sanitizeDisplayText(data.direction || "").replace(/->/g, ">" );
        return (
          <div
            key={data.key}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <Row style={styles.dataRow}>
              <Col style={styles.column} span={4}>
                {data.lineName}
              </Col>
              <Col style={styles.column} span={14}>
                {directionText}
              </Col>
              <Col style={styles.column} span={6}>
                {data.when == null
                  ? getTranslation(props.language, "cancelled")
                  : (() => {
                      let timeString = "";
                      if (data.departureTime) {
                        const date = new Date(data.departureTime);
                        timeString = date.toLocaleTimeString(props.language === "de" ? "de-DE" : "en-GB", { hour: "2-digit", minute: "2-digit" });
                      }
                      if (data.when > 0) {
                        return `${timeString} | ${data.when} ${getTranslation(props.language, "minutes")}`;
                      } else {
                        return `${timeString} | ${getTranslation(props.language, "now")}`;
                      }
                    })()
                }
              </Col>
            </Row>
            {remarkText && props.remarksVisibility && (
              <Marquee
                speed={30}
                play={!isPaused}
                style={styles.marquee}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <span
                  dangerouslySetInnerHTML={{ __html: sanitizeHTML(remarkText) }}
                  onClick={(e) =>
                    e.target.tagName === "A" && e.stopPropagation()
                  }
                />
              </Marquee>
            )}
          </div>
        );
      })}

      {/* Mobile Radar Modal */}
      {isMobile && (
        <Modal
          open={radarModalOpen}
          onCancel={() => setRadarModalOpen(false)}
          footer={null}
          width="100%"
          centered
          styles={{
            body: { padding: 0 },
            content: { padding: 0 }
          }}
          className="mobile-fullscreen-modal"
        >
          <RadarMap
            stopLocation={selectedStopLocation}
            dataSource={props.dataSource}
            language={props.language}
            isMobile={true}
          />
        </Modal>
      )}
    </div>
  );
};

export default DepartureTable;
