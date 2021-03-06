<?php

class AdminDashboardController extends WikiaController {

	// Render the Admin Dashboard chrome
	public function executeChrome () {
		global $wgRequest, $wgTitle;

		$this->tab = $wgRequest->getVal("tab", "");
		if(empty($this->tab) && $this->isAdminDashboard) {
			$this->tab = 'general';
		} else if(AdminDashboardLogic::isGeneralApp(array_shift(SpecialPageFactory::resolveAlias($wgTitle->getDBKey())))) {
			$this->tab = 'general';
		} else if(empty($this->tab)) {
			$this->tab = 'advanced';
		}

		$this->response->addAsset('extensions/wikia/AdminDashboard/css/AdminDashboard.scss');
		$this->response->addAsset('extensions/wikia/AdminDashboard/js/AdminDashboard.js');

		$this->isAdminDashboard = $this->isAdminDashboardTitle();
		$this->adminDashboardUrl = Title::newFromText('AdminDashboard', NS_SPECIAL)->getFullURL("tab=$this->tab");
		$this->adminDashboardUrlGeneral = Title::newFromText('AdminDashboard', NS_SPECIAL)->getFullURL("tab=general");
		$this->adminDashboardUrlAdvanced = Title::newFromText('AdminDashboard', NS_SPECIAL)->getFullURL("tab=advanced");
	}

	public function executeRail () {
		if (!$this->isAdminDashboardTitle()) {
			$this->skipRendering();
		}
	}

	private function isAdminDashboardTitle() {
		global $wgTitle;
		$adminDashboardTitle = SpecialPage::getTitleFor( 'AdminDashboard' );
		return $wgTitle->getText() == $adminDashboardTitle->getText();
	}

}
