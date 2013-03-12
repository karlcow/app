<div>
	<div class="social-links">
		<a href="<?= wfMessage('oasis-community-social-facebook-link')->text() ?>"><img src="<?= $wg->BlankImgUrl; ?>" class="facebook" /></a>
		<a href="<?= wfMessage('oasis-community-social-twitter-link')->text() ?>"><img src="<?= $wg->BlankImgUrl; ?>" class="twitter" /></a>
		<a href="<?= wfMessage('oasis-community-social-googleplus-link')->text() ?>"><img src="<?= $wg->BlankImgUrl; ?>" class="gplus" /></a>
	</div>
	<div class="search">
		<form method="get" action="index.php?title=Special:Search" class="WikiaSearch" id="WikiaSearch">
			<input type="text" value="" accesskey="f" autocomplete="off" placeholder="<?= wfMessage('wikiahubs-search-placeholder')->text(); ?>" name="search" id="HubSearch" />
			<input type="hidden" value="0" name="fulltext" />
			<? if (!empty($searchHubName)): ?>
				<input type="hidden" name="hub" value="<?= $searchHubName; ?>" />
			<? endif; ?>
			<input type="submit" />
			<button class="wikia-button">
				<img width="21" height="17" class="sprite search" src="<?= $wg->BlankImgUrl; ?>" />
			</button>
		</form>
	</div>
</div>
<div class="wam-content">
	<div class="title">
		<img src="<?= $wg->BlankImgUrl; ?>" class="logo" />
		<h2>
			<?= wfMessage('wikiahubs-wam-header')->text(); ?>
		</h2>
		<a href="<?= $wamPageUrl; ?>" class="read-more">
			<?= wfMessage('wikiahubs-wam-see-full-wam-ranking')->text(); ?>
		</a>
	</div>
	<h3>
		<?= wfMessage('wikiahubs-wam-top-wikis-headline', $verticalName)->text(); ?>
	</h3>
	<?php if( !empty($ranking) ): ?>
		<table class="score-table">
			<thead>
				<tr>
					<th><?= wfMessage('wikiahubs-wam-rank')->text() ?></th>
					<th><?= wfMessage('wikiahubs-wam-score')->text() ?></th>
					<th></th>
					<th><?= wfMessage('wikiahubs-wam-wiki-url')->text() ?></th>
				</tr>
			</thead>
			<tbody>
				<?php foreach($ranking as $wiki): ?>
					<tr data-rank="<?= $wiki['rank']; ?>">
						<td class="rank"><?= $wiki['rank']; ?>.</td>
						<td class="score">
							<img src="<?= $wg->BlankImgUrl; ?>" class="<?= $scoreChangeMap[$wiki['change']]; ?>" />
							<?= $wiki['wamScore']; ?>
						</td>
						<td>
							<a href="<?= $wiki['wikiUrl']; ?>" class="wiki-thumb">
								<img
									src="<?= ($wiki['imageUrl']) ? $wiki['imageUrl'] : $wg->BlankImgUrl; ?>"
									width="<?= $imagesWidth; ?>px" height="<?= $imagesHeight; ?>px"
								/>
							</a>
						</td>
						<td class="url">
							<a href="<?= $wiki['wikiUrl']; ?>" class="wiki-name"><?= $wiki['wikiName']; ?></a>
						</td>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
	<?php endif; ?>
</div>
