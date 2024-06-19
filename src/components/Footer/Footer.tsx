import React from "react";
import "./Footer.scss";

const Footer = () => {
    return (
        <footer className="footer-container open">
            <div className="stack-section">
                <div className="logo-section">
                    {/* <img src="/images/tetrist_bc.gif" alt="Tetrist Logo" /> */}
                </div>
                <div>
                    <h4>Contributor</h4>
                    <ul>
                        <li>진현정</li>
                        <li>신동원</li>
                        <li>이대원</li>
                        <li>전재민</li>
                        <li>추수연</li>
                        <li>&nbsp;</li>
                    </ul>
                </div>
                <div>
                    <h4>Front</h4>
                    <ul>
                        <li>ReactJS</li>
                        <li>ReactQuery</li>
                        <li>Redux</li>
                        <li>Redux-Toolkit</li>
                        <li>SCSS</li>
                        <li>TypeScript</li>
                    </ul>
                </div>
                <div>
                    <h4>Back</h4>
                    <ul>
                        <li>Spring Boot</li>
                        <li>Spring</li>
                        <li>Swagger</li>
                        <li>MySQL</li>
                        <li>JPA</li>
                        <li>dotenv</li>
                    </ul>
                </div>
                <div className="github-icon">
                    <a
                        href="https://github.com/RamyunLab/ramyunlab-be"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <i className="fab fa-github"></i>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
