import React from "react";
import "./Footer.scss";

const Footer = () => {
    return (
        <footer className="footer-container">
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
                    </ul>
                </div>
                <div>
                    <h4>Front</h4>
                    <ul>
                        <li>ReactJS</li>
                        <li>Redux</li>
                        <li>SCSS</li>
                        <li>ReactQuery</li>
                        <li>TypeScript</li>
                    </ul>
                </div>
                <div>
                    <h4>Back</h4>
                    <ul>
                        <li>Spring</li>
                        <li>Swagger</li>
                        <li>MySQL</li>

                        <li>Aws</li>
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
