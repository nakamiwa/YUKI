$(function () {
	'use scrict';

	//アニメーションスピード
	var $speed = 500;

	//自動再生までの時間
	var $interval = 3000;

	//カウント初期値
	var $currentNum = 1;

	//セレクタを変数に格納
	var $view = $('.carousel-view'),
		$viewContents = $view.find('.carousel-contents'),
		$viewContentsItem = $viewContents.find('.item'),
		$viewContentsItemImg = $viewContentsItem.find('img'),
		$indicator = $('#carousel ul.list-indicator'),
		$btnPrev = $('p.prev a'),
		$btnNext = $('p.next a');

	//要素の数を変数に格納
	var $viewContentsItemLength = $viewContentsItem.length;

	//カルーセルのwidthを変数に格納
	var $viewContentsItemWidth = $viewContentsItem.width();

	//画像のwidthを変数に格納
	var $viewContentsItemImgWidth = $viewContentsItemImg.width();

	//処理実行
	$viewContents.each(function () {

		var autoTimer;

		//自動スライド関数
		var autoLoad = function () {
			autoTimer = setInterval(function () {
				rollNext();
			}, $interval);
		};

		//1個以上の場合のみ
		if ($viewContentsItemLength > 1) {

			//アイテムのdivにwidthを設定
			$viewContentsItem.css('width', $viewContentsItemImgWidth);

			//インジケーター生成
			for (var i = 1; i <= $viewContentsItemLength; i++) {
				$indicator.append('<li><a href="#">' + i + '枚目</a></li>');
			}
			$indicator.find('li').first().addClass("current");

			//ループ用のクローンを前後に複製
			$viewContentsItem.first().clone().addClass("clone-f").appendTo($viewContents);
			$viewContentsItem.last().clone().addClass("clone-l").prependTo($viewContents);

			//初期カレントclassを付与
			$viewContents.find('.clone-l').next().addClass("current");

			//アイテムの数で全体のwidthを設定（クローン分を含む）
			$viewContents.css('width', $viewContentsItemWidth * ($viewContentsItemLength + 2));

			//leftをクローン分ずらして1個目の位置に
			$viewContents.css('left', - $viewContentsItemWidth);

			//自動再生
			autoLoad();
		}

		//1個の場合（インジケーター削除、クローン削除、cssリセット）
		if ($viewContentsItemLength === 1) {
			$btnPrev.parent().remove();
			$btnNext.parent().remove();
			$indicator.remove();
		}

		//右回転
		var rollNext = function () {
			clearInterval(autoTimer);
			if (!$viewContents.is(":animated")) {
				$currentNum++;
				$viewContents.find('.current').removeClass('current').next().addClass('current');
				$indicator.find('.current').removeClass('current');
				$indicator.find('li').eq($currentNum - 1).addClass('current');
				if ($currentNum > $viewContentsItemLength) {
					$indicator.find('li').eq(0).addClass('current');
				}
				$viewContents.animate({
					'left': - $viewContentsItemWidth * $currentNum,
				}, $speed, function () {
					if ($currentNum > $viewContentsItemLength) {
						$viewContents.find('.current').removeClass('current');
						$viewContents.find('.clone-l').next().addClass("current");
						$viewContents.css('left', - $viewContentsItemWidth);
						$currentNum = 1;
					}
				});
			}
			autoLoad();
		};

		//左回転
		var rollPrev = function () {
			clearInterval(autoTimer);
			if (!$viewContents.is(":animated")) {
				$currentNum--;
				$viewContents.find('.current').removeClass('current').prev().addClass('current');
				$indicator.find('.current').removeClass('current');
				$indicator.find('li').eq($currentNum - 1).addClass('current');
				if ($currentNum > $viewContentsItemLength) {
					$indicator.find('li').eq(0).addClass('current');
				}
				$viewContents.animate({
					'left': - $viewContentsItemWidth * $currentNum,
				}, $speed, function () {
					if ($currentNum < 1) {
						$viewContents.find('.current').removeClass('current');
						$viewContents.find('.clone-f').prev().addClass("current");
						$viewContents.css('left', - $viewContentsItemWidth * $viewContentsItemLength);
						$currentNum = $viewContentsItemLength;
					}
				});
			}
		};

		//右クリック
		$btnNext.click(function () {
			rollNext();
			clearInterval(autoTimer);
			return false;
		});

		//左クリック
		$btnPrev.click(function () {

			rollPrev();
			return false;
		});

		//インジケータークリック
		$indicator.find('li a').click(function () {

			//自動再生タイマーをクリア
			clearInterval(autoTimer);

			if (!$viewContents.is(":animated")) {

				//インジケーターのインデックス番号を取得
				var $indicatorIndex = $(this).parent().index() + 1;

				//カウントを更新
				$currentNum = $indicatorIndex;

				//インジケーターのカレントのclassを付け替え
				$indicator.find('.current').removeClass('current');
				$(this).parent().addClass('current');

				//アイテムのカレントのclassを付け替え
				$viewContents.find('.current').removeClass('current');
				$viewContentsItem.eq($currentNum - 1).addClass('current');

				//アニメーション
				$viewContents.animate({
					'left': - $viewContentsItemWidth * $currentNum,
				}, $speed, function () {

					/*完了時の処理は不要*/

				});
			}

			return false;
			e.preventDefault();
		});

		//リサイズ対応
		var $resizeTimer = false;
		$(window).resize(function () {
			if ($resizeTimer !== false) {
				clearTimeout($resizeTimer);
			}
			$resizeTimer = setTimeout(function () {

				//widthをリセット
				$viewContents.find('div.item').css('width', 'auto');
				$viewContents.css('width', 'auto').css('left', 'auto');

				//カルーセルのwidthを変数に格納し直す
				$viewContentsItemWidth = $viewContentsItem.width();

				//画像のwidthを変数に格納し直す
				$viewContentsItemImgWidth = $viewContentsItemImg.width();

				//アイテムのdivにwidthを設定
				$viewContents.find('div.item').css('width', $viewContentsItemImgWidth);

				//アイテムの数で全体のwidthを設定（クローン分を含む）
				$viewContents.css('width', $viewContentsItemWidth * ($viewContentsItemLength + 2));

			}, 200);
		});

		//マウスオーバー時は自動再生タイマー停止
		$view.hover(function () {
			clearInterval(autoTimer);
		}, function () {
			autoLoad();
		});
		$indicator.find('li a').hover(function () {
			clearInterval(autoTimer);
		}, function () {
			autoLoad();
		});

		//フリック対応
		$viewContents.on({

			//タッチ開始
			'touchstart': function (e) {
				this.startX = e.originalEvent.changedTouches[0].pageX;
				this.startY = e.originalEvent.changedTouches[0].pageY;
				this.touchX = e.originalEvent.changedTouches[0].pageX;
				this.slideX = $(this).position().left;

				//自動再生タイマーをクリア
				clearInterval(autoTimer);
			},

			//タッチ移動
			'touchmove': function (e) {
				var $moveX = this.startX - e.originalEvent.changedTouches[0].pageX,
					$moveY = this.startY - e.originalEvent.changedTouches[0].pageY;

				//縦スクロール対応
				var $moveRate = $moveX / $moveY;
				if ($moveRate > Math.tan(15 * Math.PI / 180)) {
					e.originalEvent.preventDefault();
				}

				this.slideX = this.slideX - (this.touchX - e.originalEvent.changedTouches[0].pageX);
				$(this).css({ left: this.slideX });
				this.touchX = e.originalEvent.changedTouches[0].pageX;
			},

			//タッチ終了
			'touchend': function (e) {
				var $diff = this.startX - this.touchX;
				if ($diff < -50) {
					rollPrev();
				} else if (50 < $diff) {
					rollNext();
				} else {
					$(this).animate({ left: this.slideX + $diff });
				}
			}
		});

	});

});