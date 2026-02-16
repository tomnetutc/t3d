import "../../App.css";
import { Col, Row } from "react-bootstrap";
import ibatur from '../../images/Head Shots/ibatur.jpg';
import abhat from '../../images/Head Shots/abhat.jpg';
import rvarghese from '../../images/Head Shots/rvarghese.jpeg';
import rpendyala from '../../images/Head Shots/rpendyala.png';
import cbhat from '../../images/Head Shots/cbhat.jpg';
import plmokhtarian from '../../images/Head Shots/plmokhtarian.webp';
import spolzin from '../../images/Head Shots/spolzin.png';
import cchen from '../../images/Head Shots/cchen.jpeg';


export function Content(): JSX.Element {

  return (
    <Row>
      <Col lg={2}></Col>
      <Col lg={10}>
        <section style={{ textAlign: "justify" }}>
          <h3 id="section1" className="mt-4 fw-bold contenthead">
            About
          </h3>
          <p className="mt-4">
            The <span style={{ textDecoration: 'underline' }}>T</span>ime Use, <span style={{ textDecoration: 'underline' }}>T</span>ravel, and <span style={{ textDecoration: 'underline' }}>T</span>elework Dashboard (T3D) is an
            open-source platform designed to offer insights into time
            use, travel, and telework trends and patterns within the
            United States. This platform was developed with support
            from the Center for Teaching Old Models New Tricks (
            <a href="https://tomnet-utc.engineering.asu.edu/" target="_blank">
              TOMNET
            </a>
            ) and the Center for Understanding Future Travel Behavior
            and Demand (
            <a href="https://tbd.ctr.utexas.edu/" target="_blank">
              TBD
            </a>
            ), both of which are University Transportation Centers
            funded by the US Department of Transportation.
          </p>

          <p>
            T3D aims to make data from the American Time Use Survey (
            <a href="https://www.bls.gov/tus/" target="_blank">
              ATUS
            </a>
            )
            accessible to researchers, planners, policymakers, and the public, facilitating the democratization and wider utilization of publicly available datasets. The dashboard features three specific pages focused on Time Use, Travel, and Telework, enabling users to explore patterns and trends. T3D uses preprocessed ATUS data series and offers the ability to conduct both within and between-year as well as cross-segment analyses for a detailed understanding of evolving trends in how Americans spend their time. It also includes tools for tailoring analyses to various population subgroups and market segments.
          </p>
          <p>
            Each page of the dashboard —Time Use, Travel, and Telework— is designed to be self-explanatory, with all charts and graphs featuring an information button to explain the presented data. Some concepts, however, may require further explanations as listed below.
          </p>
        </section>
        <section style={{ textAlign: "justify" }}>
          <h5 className="mt-4 fw-bold contenthead">
            Time poverty
          </h5>
          <p className="mt-4 mb-4">
            The notion of time poverty is often used to describe individuals who do not have enough time to engage in discretionary activities that presumably enhance wellbeing. Similar to income-based poverty, time poverty is linked to poorer wellbeing. To identify individuals experiencing time poverty, activities are first classified into necessary, committed, and discretionary categories. Necessary and committed activities include personal care, household chores, caregiving, and work, while all other activities are considered discretionary. The time spent on necessary and committed activities is then aggregated for each respondent and subtracted from the 1,440 minutes available in a day to determine the remaining time for discretionary activities. Subsequently, the median discretionary time is calculated for the sample in a given year, and individuals with discretionary time less than 60% of this median are deemed time-poor (or not time-poor otherwise).
          </p>
        </section>

        <section style={{ textAlign: "justify" }}>
          <h5 className="mt-4 fw-bold contenthead">
            Zero trip-making
          </h5>
          <p className="mt-4 mb-4">
            Zero trip-making refers to situations where individuals do not undertake any trips throughout the day. This condition may lead to feelings of social isolation, depression, and other mental health problems as a result of not being able to interact in person with others outside the home. Zero trip-making is generally seen as a negative indicator of wellbeing, indicating that those who do not make any trips in a full day may have a lower quality of life. Identifying zero trip-makers in ATUS datasets is straightforward. If a person's activity time use diary does not report any travel outside the home, they are classified as a zero trip-maker in the dataset (or trip-maker otherwise).
          </p>

          <p className="mt-4">
            More details about the notions of time poverty and zero trip-making can be found in the following sources:
          </p>
          <ul>
            <li className="mt-4">
              Batur, I., Dirks, A. C., Bhat, C. R., Polzin, S. E., Chen, C., and Pendyala, R. M. (2023).
              Analysis of Changes in Time Use and Activity Participation in Response to the COVID-19 Pandemic in the United States: Implications for well-being.
              Transportation Research Record, 03611981231165020.&nbsp;
              <a href="https://doi.org/10.1177/03611981231165020" target="_blank" rel="noopener noreferrer">https://doi.org/10.1177/03611981231165020</a>
            </li>
            <li className="mt-4">
              Batur, I. (2023). Understanding and Modeling the Nexus of Mobility, Time Poverty, and Wellbeing (Doctoral dissertation, Arizona State University).&nbsp;
              <a href="https://hdl.handle.net/2286/R.2.N.189319" target="_blank" rel="noopener noreferrer">https://hdl.handle.net/2286/R.2.N.189319</a>
            </li>
          </ul>
        </section>

        <section style={{ textAlign: "justify" }}>
          <h5 className="mt-4 fw-bold contenthead">
            Work arrangement
          </h5>
          <p className="mt-4 mb-4">
            The T3D provides in-depth insights into work arrangement trends among workers. It classifies respondents in the ATUS data series into distinct groups based on their employment status and the location and presence of their work activities as recorded in their time use diaries:
          </p>
          <ol>
            <li className="mt-4">
              <strong>Non-workers</strong>: This group includes individuals who have indicated that they are not participating in the labor force.
            </li>
            <li className="mt-4">
              <strong>Workers with Zero Work</strong>: This category comprises respondents who reported no work activity in their time use diary.
            </li>
            <li className="mt-4">
              <strong>In-home Only Workers</strong>: These individuals are those who reported working exclusively from home, with no reported out-of-home work activity.
            </li>
            <li className="mt-4">
              <strong>Commuters Only</strong>: Respondents in this group reported engaging in at least some out-of-home work activity in their time use diary, without any in-home work activity.
            </li>
            <li className="mt-4">
              <strong>Multi-site Workers</strong>: This category encompasses those who reported both out-of-home and in-home work activity in their time use diary.
            </li>
          </ol>
        </section>

        <section style={{ textAlign: "justify" }}>
          <h5 className="mt-4 fw-bold contenthead">
            Segment attributes
          </h5>
          <p className="mt-4 mb-4">
            Each page offers users the ability to tailor their analysis to specific market segments (subpopulation groups). Users can define these segments by choosing up to three attributes from a range of socio-demographic, household, travel, and other variables.
          </p>
          <p className="mt-4">
            Detailed explanations of these attributes are available in this <a href="data_dictionary.xlsx" target="_blank" download>
              data dictionary
            </a>.
          </p>
          <p>
            <em>
              More details about T3D may be found in this&nbsp;
              <a href="https://www.youtube.com/watch?v=eDY0rcXDm2A&t=3876s" target="_blank" rel="noopener noreferrer">webinar</a>.
            </em>
          </p>
        </section>


        <section style={{ textAlign: "justify" }}>
          <h3 id="section2" className="mt-4 fw-bold contenthead">
            Data source
          </h3>
          <p className="mt-4">
            The primary data source for these analyses is the American Time Use
            Survey (
            <a href="https://www.bls.gov/tus/" target="_blank">
              ATUS
            </a>
            ). It collects detailed activity and time use data from randomly selected individuals (15+) who are interviewed only once for their time-use diary on the previous day (4 am to 4 am), resulting in nationally representative estimates of how people spend their time. The survey, which is sponsored by the Bureau of Labor Statistics (BLS), has been conducted by the U.S. Census Bureau every year since 2003 and consists of a sample of approximately 10,000 respondents per year.
          </p>
          <p className="mt-4">
          Respondents in ATUS provide information on the time, location, and type of activities pursued, as well as who they were with during each activity, when reporting their time use data. Furthermore, respondents report their socio-demographic information, such as gender, race, age, educational attainment, occupation, income, marital status, and the presence of children in the household. Additional details on the survey sample and respondent characteristics are available on the Survey Sample page.
          </p>
          <p className="mt-4">
            For more information on ATUS, please visit this
            <a className="ps-1" href="https://www.bls.gov/tus/" target="_blank">
              link
            </a>.
          </p>
          <p>
            <em>
              If you would like access to the full data set used in the T3D platform and/or seek collaboration opportunities, please contact Dr. Irfan Batur at<a className="ms-1">ibatur@asu.edu</a>.
            </em>
          </p>
        </section>


        <section className="text-justify" style={{ marginTop: '2rem' }}>
          <h3 id="section3" className="mt-4 fw-bold contenthead">
            Team
          </h3>
          <div className="row text-center">
            <div className="col">
              <a href="https://search.asu.edu/profile/3243599" target="_blank" className="text-decoration-none">
                <figure className="figure">
                  <img src={ibatur} className="figure-img img-fluid rounded-circle" alt="Irfan Batur, PhD" style={{ width: '150px', height: '150px' }} />
                  <figcaption className="figure-caption" style={{ fontWeight: 'bold' }}>Irfan Batur, PhD</figcaption>
                  <figcaption className="figure-caption">Role: Principal Investigator</figcaption>
                  <figcaption className="figure-caption" style={{ fontStyle: 'italic' }} >Arizona State University</figcaption>
                </figure>
              </a>
            </div>
            <div className="col">
              <a href="https://www.linkedin.com/in/ashwathbhat98/" target="_blank" className="text-decoration-none">
                <figure className="figure">
                  <img src={abhat} className="figure-img img-fluid rounded-circle" alt="Ashwath Bhat L" style={{ width: '150px', height: '150px' }} />
                  <figcaption className="figure-caption" style={{ fontWeight: 'bold' }} >Ashwath Bhat L</figcaption>
                  <figcaption className="figure-caption">Role: Lead Developer</figcaption>
                  <figcaption className="figure-caption" style={{ fontStyle: 'italic' }} >Arizona State University</figcaption>
                </figure>
              </a>
            </div>
            <div className="col">
              <a href="https://www.linkedin.com/in/roshan--varghese/" target="_blank" className="text-decoration-none">
                <figure className="figure">
                  <img src={rvarghese} className="figure-img img-fluid rounded-circle" alt="Roshan Varghese" style={{ width: '150px', height: '150px' }} />
                  <figcaption className="figure-caption" style={{ fontWeight: 'bold' }}>Roshan Varghese</figcaption>
                  <figcaption className="figure-caption">Role: Developer</figcaption>
                  <figcaption className="figure-caption" style={{ fontStyle: 'italic' }} >Arizona State University</figcaption>
                </figure>
              </a>
            </div>
            <div className="col">
              <a href="https://search.asu.edu/profile/980477" target="_blank" className="text-decoration-none">
                <figure className="figure">
                  <img src={rpendyala} className="figure-img img-fluid rounded-circle" alt="Ram M. Pendyala, PhD" style={{ width: '150px', height: '150px' }} />
                  <figcaption className="figure-caption" style={{ fontWeight: 'bold' }}>Ram M. Pendyala, PhD</figcaption>
                  <figcaption className="figure-caption">Role: Chief Science Officer</figcaption>
                  <figcaption className="figure-caption" style={{ fontStyle: 'italic' }} >Arizona State University</figcaption>
                </figure>
              </a>
            </div>
          </div>
          <div className="row text-center">
            <div className="col">
              <a href="https://www.caee.utexas.edu/prof/bhat/home.html" target="_blank" className="text-decoration-none">
                <figure className="figure">
                  <img src={cbhat} className="figure-img img-fluid rounded-circle" alt="Chandra R. Bhat, PhD" style={{ width: '150px', height: '150px' }} />
                  <figcaption className="figure-caption" style={{ fontWeight: 'bold' }}>Chandra R. Bhat, PhD</figcaption>
                  <figcaption className="figure-caption">Role: Co-Principal Investigator</figcaption>
                  <figcaption className="figure-caption" style={{ fontStyle: 'italic' }} >The University of Texas at Austin</figcaption>
                </figure>
              </a>
            </div>
            <div className="col">
              <a href="https://ce.gatech.edu/directory/person/patricia-l-mokhtarian" target="_blank" className="text-decoration-none">
                <figure className="figure">
                  <img src={plmokhtarian} className="figure-img img-fluid rounded-circle" alt="Patricia L. Mokhtarian, PhD" style={{ width: '150px', height: '150px' }} />
                  <figcaption className="figure-caption" style={{ fontWeight: 'bold' }}>Patricia L. Mokhtarian, PhD</figcaption>
                  <figcaption className="figure-caption">Role: Senior Advisor</figcaption>
                  <figcaption className="figure-caption" style={{ fontStyle: 'italic' }} >Georgia Institute of Technology</figcaption>
                </figure>
              </a>
            </div>
            <div className="col">
              <a href="https://search.asu.edu/profile/3993044" target="_blank" className="text-decoration-none">
                <figure className="figure">
                  <img src={spolzin} className="figure-img img-fluid rounded-circle" alt="Steven E. Polzin, PhD" style={{ width: '150px', height: '150px' }} />
                  <figcaption className="figure-caption" style={{ fontWeight: 'bold' }}>Steven E. Polzin, PhD</figcaption>
                  <figcaption className="figure-caption">Role: Senior Advisor</figcaption>
                  <figcaption className="figure-caption" style={{ fontStyle: 'italic' }} >Arizona State University</figcaption>
                </figure>
              </a>
            </div>
            <div className="col">
              <a href="https://www.ce.washington.edu/facultyfinder/cynthia-chen" target="_blank" className="text-decoration-none">
                <figure className="figure">
                  <img src={cchen} className="figure-img img-fluid rounded-circle" alt="Cynthia Chen, PhD" style={{ width: '150px', height: '150px' }} />
                  <figcaption className="figure-caption" style={{ fontWeight: 'bold' }}>Cynthia Chen, PhD</figcaption>
                  <figcaption className="figure-caption">Role: Senior Advisor</figcaption>
                  <figcaption className="figure-caption" style={{ fontStyle: 'italic' }} >University of Washington</figcaption>
                </figure>
              </a>
            </div>
          </div>
        </section>


        <section style={{ textAlign: "justify" }}>
          <h3 id="section4" className="mt-4 fw-bold contenthead">
            Citations
          </h3>
          <p className="mt-4">
            <strong>Note:</strong> When using any material from this website, please consider citing
            the relevant papers listed below.
          </p>
          <ul>
            <li className="mt-4">
              Batur, I., Bhat, A. L., Varghese, R., Bhat, C. R., Mokhtarian, P. L., Polzin, S. E., Chen, C. and Pendyala, R. M. The Time Use, Travel, and Telework Dashboard (T3D). TOMNET and TBD University Transportation Centers, 2024.&nbsp;
              <a href="https://tomnetutc.github.io/t3d/" target="_blank" rel="noopener noreferrer">https://tomnetutc.github.io/t3d/</a>
            </li>
            <li className="mt-4">
              Batur, I., Dirks, A. C., Bhat, C. R., Polzin, S. E., Chen, C., and Pendyala, R. M. (2023). Analysis of Changes in Time Use and Activity Participation in Response to the COVID-19 Pandemic in the United States: Implications for well-being. Transportation Research Record, 03611981231165020.&nbsp;
              <a href="https://doi.org/10.1177/03611981231165020" target="_blank" rel="noopener noreferrer">https://doi.org/10.1177/03611981231165020</a>
            </li>
            <li className="mt-4">
              Batur, I. (2023). Understanding and Modeling the Nexus of Mobility, Time Poverty, and Wellbeing (Doctoral dissertation, Arizona State University).&nbsp;
              <a href="https://hdl.handle.net/2286/R.2.N.189319" target="_blank" rel="noopener noreferrer">https://hdl.handle.net/2286/R.2.N.189319</a>
            </li>
          </ul>
        </section>

        {/*
          Spacing for the footer
        */}

        <div style={{ padding: '15px 0' }} />

      </Col>
    </Row>
  );
}
