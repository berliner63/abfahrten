import React, { useState } from "react";
import { Modal, Typography } from "antd";
import { getTranslation } from "../dictionary";

const { Title, Paragraph } = Typography;

const privacyContent = {
  de: (
    <div style={{ maxHeight: "300px", overflow: "auto" }}>
      <Paragraph>
        <b>Verantwortlich für diese Website:</b>
        <br />
        Andreas Kuhl
        <br />
        E-Mail:{" "}
        <a href="mailto:andreas.kuhl@magenta.de">
          andreas.kuhl@magenta.de
        </a>
      </Paragraph>
      <Title level={5}>1. Allgemeines</Title>
      <Paragraph>
        Der Schutz Ihrer persönlichen Daten ist mir ein besonderes Anliegen. Ich
        verarbeite Ihre Daten daher ausschließlich auf Grundlage der
        gesetzlichen Bestimmungen (DSGVO, TMG).
      </Paragraph>
      <Title level={5}>
        2. Erhebung und Speicherung personenbezogener Daten
      </Title>
      <Paragraph>
        Beim Besuch dieser Website werden folgende Daten automatisch erfasst:
        <br />- IP-Adresse
        <br />- Datum und Uhrzeit des Zugriffs
        <br />- Besuchte Seiten
        <br />- Referrer-URL (Website, von der Sie kommen)
        <br />- Browsertyp/-version
        <br />- Betriebssystem
      </Paragraph>
      <Paragraph>
        Diese Daten werden für die Systemsicherheit, zur Fehlerdiagnose und für
        statistische Zwecke verwendet. Eine Zusammenführung mit anderen
        Datenquellen erfolgt nicht.
      </Paragraph>
      <Title level={5}>3. Verwendung von Cookies</Title>
      <Paragraph>
        Diese Website verwendet Cookies. Cookies sind kleine Textdateien, die
        auf Ihrem Endgerät gespeichert werden. Sie dienen der nutzerfreundlichen
        Gestaltung der Website.
      </Paragraph>
      <Paragraph>
        Sie können die Verwendung von Cookies über Ihre Browsereinstellungen
        einschränken oder verhindern. Die Deaktivierung von Cookies kann jedoch
        die Funktionalität der Website beeinträchtigen.
      </Paragraph>
      <Title level={5}>4. Kontakt zum Datenschutz</Title>
      <Paragraph>
        Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer
        personenbezogenen Daten wenden Sie sich bitte an:
        <br /> <b>Andreas Kuhl</b> –{" "}
        <a href="mailto:andreas.kuhl@magenta.de">
          andreas.kuhl@magenta.de
        </a>
      </Paragraph>
    </div>
  ),
  en: (
    <div style={{ maxHeight: "300px", overflow: "auto" }}>
      <Paragraph>
        <b>Responsible person for this website:</b>
        <br />
        Andreas Kuhl
        <br />
        Email:{" "}
        <a href="mailto:andreas.kuhl@magenta.de">
          andreas.kuhl@magenta.de
        </a>
      </Paragraph>
      <Title level={5}>1. General Information</Title>
      <Paragraph>
        Protecting your personal data is very important to us. Your data is
        processed in accordance with the EU General Data Protection Regulation
        (GDPR) and the German Telemedia Act (TMG).
      </Paragraph>
      <Title level={5}>2. Data Collected</Title>
      <Paragraph>
        When you visit this website, the following data may be collected
        automatically:
        <br />- IP address
        <br />- Date and time of access
        <br />- Visited pages
        <br />- Referrer URL
        <br />- Browser and OS details
      </Paragraph>
      <Paragraph>
        This data is used for security, troubleshooting, and anonymous
        statistics. It is not merged with other data.
      </Paragraph>
      <Title level={5}>3. Cookies</Title>
      <Paragraph>
        This website uses cookies to improve user experience. You can disable
        cookies via your browser settings. Disabling cookies may affect website
        functionality.
      </Paragraph>
      <Title level={5}>4. Contact</Title>
      <Paragraph>
        For questions related to your data, contact:
        <br /> <b>Andreas Kuhl</b> –{" "}
        <a href="mailto:andreas.kuhl@magenta.de">
          andreas.kuhl@magenta.de
        </a>
      </Paragraph>
    </div>
  ),
};

const termsContent = {
  de: (
    <div style={{ maxHeight: "300px", overflow: "auto" }}>
      <Paragraph>
        <b>Gültig ab:</b> 16. März 2026
        <br />
        <b>Betreiber:</b> Andreas Kuhl –{" "}
        <a href="mailto:andreas.kuhl@magenta.de">
          andreas.kuhl@magenta.de
        </a>
      </Paragraph>
      <Title level={5}>1. Geltungsbereich</Title>
      <Paragraph>
        Diese Website richtet sich an Nutzer aus Deutschland. Mit dem Zugriff
        auf die Website erklären Sie sich mit diesen Bedingungen einverstanden.
      </Paragraph>
      <Title level={5}>2. Inhalte</Title>
      <Paragraph>
        Die Inhalte auf dieser Website dienen ausschließlich der Information. Es
        wird keine Haftung für Richtigkeit, Vollständigkeit oder Aktualität
        übernommen.
      </Paragraph>
      <Title level={5}>3. Urheberrecht</Title>
      <Paragraph>
        Alle Inhalte, Bilder und Texte sind urheberrechtlich geschützt und
        dürfen ohne schriftliche Zustimmung nicht verwendet werden.
      </Paragraph>
      <Title level={5}>4. Haftung</Title>
      <Paragraph>
        Der Betreiber haftet nicht für etwaige Schäden, die durch die Nutzung
        dieser Website entstehen, es sei denn, sie beruhen auf Vorsatz oder
        grober Fahrlässigkeit.
      </Paragraph>
      <Title level={5}>5. Externe Links</Title>
      <Paragraph>
        Diese Website kann Links zu externen Websites enthalten. Für deren
        Inhalte wird keine Verantwortung übernommen.
      </Paragraph>
      <Title level={5}>6. Gerichtsstand und anwendbares Recht</Title>
      <Paragraph>Es gilt deutsches Recht. Gerichtsstand ist Berlin.</Paragraph>
    </div>
  ),
  en: (
    <div style={{ maxHeight: "300px", overflow: "auto" }}>
      <Paragraph>
        <b>Valid from:</b> March 16, 2026
        <br />
        <b>Operator:</b> Andreas Kuhl –{" "}
        <a href="mailto:andreas.kuhl@magenta.de">
          andreas.kuhl@magenta.de
        </a>
      </Paragraph>
      <Title level={5}>1. Scope</Title>
      <Paragraph>
        This website is intended for users in Germany. By accessing the site,
        you agree to these terms.
      </Paragraph>
      <Title level={5}>2. Content</Title>
      <Paragraph>
        The content on this website is provided for informational purposes only.
        No liability is assumed for accuracy, completeness or timeliness.
      </Paragraph>
      <Title level={5}>3. Copyright</Title>
      <Paragraph>
        All content, images, and text are protected by copyright and may not be
        used without written permission.
      </Paragraph>
      <Title level={5}>4. Liability</Title>
      <Paragraph>
        The operator is not liable for any damages arising from the use of this
        website unless they are due to intent or gross negligence.
      </Paragraph>
      <Title level={5}>5. External links</Title>
      <Paragraph>
        This website may contain links to external websites. We are not
        responsible for their content.
      </Paragraph>
      <Title level={5}>6. Jurisdiction and applicable law</Title>
      <Paragraph>
        German law applies. The place of jurisdiction is Berlin.
      </Paragraph>
    </div>
  ),
};

const LegalModals = ({ language }) => {
  const [privacyVisible, setPrivacyVisible] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);

  return (
    <div style={{ textAlign: "center", marginBottom: "8px" }}>
      <Modal
        title={getTranslation(language, "privacyPolicy")}
        open={privacyVisible}
        footer={null}
        onCancel={() => setPrivacyVisible(false)}
      >
        {privacyContent[language]}
      </Modal>
      <Modal
        title={getTranslation(language, "termsOfService")}
        open={termsVisible}
        footer={null}
        onCancel={() => setTermsVisible(false)}
      >
        {termsContent[language]}
      </Modal>
      <span
        style={{ cursor: "pointer", marginRight: "16px", color: "orange" }}
        onClick={() => setPrivacyVisible(true)}
      >
        {getTranslation(language, "privacyPolicy")}
      </span>
      <span
        style={{ cursor: "pointer", color: "orange" }}
        onClick={() => setTermsVisible(true)}
      >
        {getTranslation(language, "termsOfService")}
      </span>
    </div>
  );
};

export default LegalModals;
