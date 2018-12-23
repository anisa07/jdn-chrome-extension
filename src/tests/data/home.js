export const homePage = '<body>\n' +
	'<header>\n' +
	'     <div class="uui-header dark-gray">        <nav role="navigation">            <div class="sidebar-toggle-box blue" style="display: none;">                <div data-toggle="tooltip" data-placement="right" title="Toggle Navigation" class="sidebar-tooltip">                    <span class="fa fa-reorder"></span>                </div>            </div>            <div class="epam-logo">\t\t\t\t<a href="/JDI/index.html">\t\t\t\t\t<span>Information<br>Framework</span>\t\t\t\t\t<img src="images/Logo_Epam_Color.svg" alt="ALT" id="epam_logo" width="86">\t\t\t\t</a>            </div>\t\t\t<ul class="uui-navigation nav navbar-nav m-l8">                <li>                    <a href="index.html">Home</a>                </li>                <li>                    <a href="contacts.html">Contact form</a>                </li>                <li class="dropdown">                    <a class="dropdown-toggle" data-toggle="dropdown"> Service                        <span class="caret"></span>                    </a>                    <ul class="dropdown-menu" role="menu">                        <li><a href="support.html">Support</a></li>                        <li><a href="dates.html">Dates</a></li>                        <li><a href="complex-table.html">Complex Table </a></li>                        <li><a href="simple-table.html">Simple Table </a></li>                        <li><a href="user-table.html">User Table </a></li>                        <li><a href="table-pages.html">Table with pages</a></li>                        <li><a href="different-elements.html">Different elements</a></li>\t\t\t\t\t\t<li><a href="performance.html">Performance</a></li>                    </ul>                </li>                <li>                    <a href="metals-colors.html">Metals &amp; Colors</a>                </li>            </ul>            <ul class="uui-navigation navbar-nav navbar-right">                <li class="dropdown uui-profile-menu">                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">                        <div class="profile-photo">                            <!--i class="fa fa-user"></i-->                            <img src="images/icons/user-icon.jpg" alt="" id="user-icon">                            <span ui="label">Piter Chailovskii</span>                        </div>                        <span class="caret"></span>                    </a>                    <div class="dropdown-menu dropdown-menu-login" role="menu">                        <form class="form-horizontal login hidden" id="login-form">                            <div class="form-horizontal-pad">                                <div class="form-group form-group10">                                    <label for="Name" class="col-sm-3">Login</label>                                    <div class="col-sm-9">                                        <input id="Name" type="text" class="uui-form-element">                                    </div>                                </div>                                <div class="form-group form-group10">                                    <label for="Password" class="col-sm-3">Password</label>                                    <div class="col-sm-9">                                        <input id="Password" type="password" class="uui-form-element">                                    </div>                                </div>                                <span class="login-txt hidden">* Login Faild</span>                            </div>                            <button type="submit" class="uui-button dark-blue btn-login"><i class="fa fa-sign-in"></i><span>Enter</span></button>                        </form>                        <div class="logout">                            <button type="submit" class="uui-button dark-blue btn-login"><i class="fa fa-sign-out"></i><span>Logout</span></button>                        </div>                    </div>                </li>            </ul>            <div class="search">                <span class="icon-search"></span>                <div class="search-active hidden">                    <span class="search-title">Search this Site</span>                    <span class="icon-search active"></span>                    <div class="search-field">                        <input type="text">                    </div>                </div>            </div>        </nav>    </div>\n' +
	'</header>\n' +
	'<div class="wrapper">\n' +
	'    <div name="navigation-sidebar" class="uui-side-bar mCustomScrollbar _mCS_1 mCS_no_scrollbar" style="max-height: inherit; display: block;"><div id="mCSB_1" class="mCustomScrollBox mCS-light mCSB_vertical mCSB_inside" tabindex="0" style="max-height: inherit;"><div id="mCSB_1_container" class="mCSB_container mCS_y_hidden mCS_no_scrollbar_y" style="position:relative; top:0; left:0;" dir="ltr"><div id="mCSB_1" class="mCustomScrollBox mCS-light mCSB_vertical mCSB_inside" tabindex="0" style="max-height: inherit;"><div id="mCSB_1_container" class="mCSB_container mCS_y_hidden mCS_no_scrollbar_y" style="position:relative; top:0; left:0;" dir="ltr">        <ul class="sidebar-menu">            <li ui="label" index="1" class="active">                <a href="index.html">                    <span>Home</span>                </a>            </li>            <li ui="label" index="2">                <a href="contacts.html">                    <span>Contact form</span>                </a>            </li>            <li class="menu-title" index="3">                <a ui="label">                    <span>Service</span>                    <div class="fa fa-caret-down arrow"></div>                </a>                <ul class="sub hide-menu">                    <li ui="label" index="1"><a href="support.html"><p>                        <span>Support</span>                    </p></a></li>                    <li ui="label" index="2"><a href="dates.html"><p>                        <span>Dates</span>                    </p></a></li>                    <li ui="label" index="3"><a href="complex-table.html"><p>                        <span>Complex Table </span>                    </p></a></li>                    <li ui="label" index="4"><a href="simple-table.html"><p>                        <span>Simple Table</span>                    </p></a></li>                    <li ui="label" index="5"><a href="user-table.html"><p>                        <span>User Table</span>                    </p></a></li>                    <li ui="label" index="6"><a href="table-pages.html"><p>                        <span>Table with pages</span>                    </p></a></li>                    <li ui="label" index="7"><a href="different-elements.html"><p>                        <span>Different elements</span>                    </p></a></li>                    <li ui="label" index="8"><a href="performance.html"><p>                        <span>Performance</span>                    </p></a></li>                </ul>            </li>            <li ui="label" index="4">                <a href="metals-colors.html">                    <span>Metals &amp; Colors</span>                </a>            </li>            <li class="menu-title" index="5">                <a>                    <span>Elements packs</span>                    <div class="fa fa-caret-down arrow"></div>                </a>                <ul class="sub hide-menu">                    <li ui="label" index="1"><a href="html5.html"><p>                        <span>HTML 5</span>                    </p></a></li>                    <li ui="label" index="2"><a><p>                        <span>Bootstrap</span>                    </p></a></li>                </ul>            </li>        </ul>    </div><div id="mCSB_1_scrollbar_vertical" class="mCSB_scrollTools mCSB_1_scrollbar mCS-light mCSB_scrollTools_vertical" style="display: none;"><div class="mCSB_draggerContainer"><div id="mCSB_1_dragger_vertical" class="mCSB_dragger" style="position: absolute; min-height: 0px; top: 0px; height: 0px;" oncontextmenu="return false;"><div class="mCSB_dragger_bar" style="line-height: 0px;"></div></div><div class="mCSB_draggerRail"></div></div></div></div></div><div id="mCSB_1_scrollbar_vertical" class="mCSB_scrollTools mCSB_1_scrollbar mCS-light mCSB_scrollTools_vertical"><div class="mCSB_draggerContainer"><div id="mCSB_1_dragger_vertical" class="mCSB_dragger" style="position:absolute;" oncontextmenu="return false;"><div class="mCSB_dragger_bar"></div></div><div class="mCSB_draggerRail"></div></div></div></div></div>\n' +
	'    <div class="uui-main-container">\n' +
	'        <main>\n' +
	'            <div class="pattern-top"></div>\n' +
	'            <div class="main-content">\n' +
	'                <h3 class="main-title text-center" name="main-title">EPAM framework Wishes…</h3>\n' +
	'\n' +
	'                <p class="main-txt text-center" name="jdi-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\n' +
	'                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud\n' +
	'                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in\n' +
	'                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>\n' +
	'\t\t\t\t<h3 class="text-center"><a href="https://github.com/epam/JDI" target="_blank">JDI Github</a></h3>\n' +
	'\t\t\t\t<iframe id="iframe" src="https://epam.github.io/JDI/index.html" width="100%">\n' +
	'\t\t\t\t  <p>Your browser does not support iframes.</p>\n' +
	'\t\t\t\t</iframe>\n' +
	'                <div class="row clerafix benefits">\n' +
	'                    <div class="col-sm-3">\n' +
	'                        <div class="benefit">\n' +
	'                            <div class="benefit-icon">\n' +
	'                                <span class="icons-benefit icon-practise"></span>\n' +
	'                            </div>\n' +
	'                            <span class="benefit-txt">To include good practices<br>and ideas from successful<br>EPAM project</span>\n' +
	'                        </div>\n' +
	'                    </div>\n' +
	'                    <div class="col-sm-3">\n' +
	'                        <div class="benefit">\n' +
	'                            <div class="benefit-icon">\n' +
	'                                <span class="icons-benefit icon-custom"></span>\n' +
	'                            </div>\n' +
	'                            <span class="benefit-txt">To be flexible and<br>customizable </span>\n' +
	'                        </div>\n' +
	'                    </div>\n' +
	'                    <div class="col-sm-3">\n' +
	'                        <div class="benefit">\n' +
	'                            <div class="benefit-icon">\n' +
	'                                <span class="icons-benefit icon-multi"></span>\n' +
	'                            </div>\n' +
	'                            <span class="benefit-txt">To be multiplatform </span>\n' +
	'                        </div>\n' +
	'                    </div>\n' +
	'                    <div class="col-sm-3">\n' +
	'                        <div class="benefit">\n' +
	'                            <div class="benefit-icon">\n' +
	'                                <span class="icons-benefit icon-base"></span>\n' +
	'                            </div>\n' +
	'                            <span class="benefit-txt">Already have good base<br>(about 20 internal and<br>some external projects),<br>wish to get more…</span>\n' +
	'                        </div>\n' +
	'                    </div>\n' +
	'                </div>\n' +
	'            </div>\n' +
	'        </main>\n' +
	'    </div>\n' +
	'</div>\n' +
	'<footer>\n' +
	'    <div class="footer-bg">        <div class="footer-content overflow">            <div>Powered by EPAM System</div>            <ul class="footer-menu">\t\t\t\t<li><a href="support.html" title="Tip title">About</a></li>                <li>|</li>                <li><a href="">Report a bug</a></li>            </ul>        </div>    </div>\n' +
	'</footer>\n' +
	'\n' +
	'    <script language="JavaScript">\n' +
	'        UUI.Vertical_Menu.init({"open": true});\n' +
	'    </script>\n' +
	'    <script>\n' +
	'\t\tincludeSideBar();\n' +
	'\t\tactivateTopElement(1);\n' +
	'\t</script>\n' +
	'\n' +
	'</body>';
