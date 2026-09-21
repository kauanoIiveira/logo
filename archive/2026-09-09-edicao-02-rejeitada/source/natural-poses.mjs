// Postures share the approved face and tail. Limbs are placed at shoulders and hips.
import {palette, geometry, head, tail, seated} from './mascot.mjs';

const plain = s => ['silhouette','black','reverse'].includes(s);
function color(part,s,id) {
  if(s==='black')return '#000000';
  if(s==='reverse')return '#FFFFFF';
  if(s==='silhouette'||s==='mono')return palette.purple;
  if(part==='far')return '#E77C10';
  if(s==='solid')return ['gold','tip'].includes(part)?palette.gold:palette.orange;
  return `url(#${id}-${part})`;
}
const shape=(d,part,s,id,attrs='')=>`<path d="${d}" fill="${color(part,s,id)}" ${attrs}/>`;
const patch=(d,s,id)=>plain(s)?'':shape(d,'gold',s,id);
const limb=(d,s,id,far=false)=>shape(d,far?'far':'body',s,id,`data-part="${far?'far':'near'}-leg"`);
function face(x,y,scale,s,id,{angle=0,expression='neutro',mirror=false,view='main'}={}) {
  return `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${mirror?-scale:scale} ${scale}) translate(-701 -430)">${view==='profile'?sideFace(s,id):head({style:s,id,expression})}</g>`;
}
function attachedTail(x,y,scale,angle,s,id) {
  // The origin lies inside the tail base; every body overlaps this root.
  return `<g data-joint="tail-root" transform="translate(${x} ${y}) rotate(${angle}) scale(${scale}) translate(-420 -835)">${tail({style:s,id})}</g>`;
}
function body(d,s,id){return shape(d,'body',s,id,'data-part="torso"');}

// A true frontal face: same masses, level eyes and nose, perspective removed.
const frontOutline='M465 357 C495 346 514 326 520 288 L540 157 C544 130 550 115 562 115 C580 115 601 145 623 180 L650 221 Q690 212 730 221 L757 180 C779 145 800 115 818 115 C830 115 836 130 840 157 L860 288 C866 326 885 346 915 357 Q940 365 918 378 Q946 383 924 398 L904 410 Q928 419 906 432 C851 462 775 486 690 486 C605 486 529 462 474 432 Q452 419 476 410 L456 398 Q434 383 462 378 Q440 365 465 357 Z';
const frontMask='M462 378 C510 366 552 391 604 419 C621 428 639 395 659 382 Q690 357 721 382 C741 395 759 428 776 419 C828 391 870 366 918 378 Q946 383 924 398 L904 410 Q928 419 906 432 C851 462 775 486 690 486 C605 486 529 462 474 432 Q452 419 476 410 L456 398 Q434 383 462 378 Z';
function frontFace(s,id) {
  let a=shape(frontOutline,'head',s,id);
  if(!plain(s))a+=patch(frontMask,s,id)+`<ellipse data-feature="eye" cx="618" cy="350" rx="19" ry="30" fill="#000000"/><ellipse data-feature="eye" cx="762" cy="350" rx="19" ry="30" fill="#000000"/><ellipse cx="613" cy="340" rx="7" ry="8" fill="#FFFFFF"/><ellipse cx="757" cy="340" rx="7" ry="8" fill="#FFFFFF"/><ellipse cx="690" cy="405" rx="20" ry="13" fill="${palette.purple}"/>`;
  return `<g data-part="head" data-view="front">${a}</g>`;
}
export function naturalFront({style:s='gradient',id='m'}={}) {
  const torso='M596 452 C597 531 572 586 552 664 C537 706 550 765 588 793 C631 822 656 827 690 812 C724 827 749 822 792 793 C830 765 843 706 828 664 C808 586 783 531 784 452 Z';
  const haunchL='M540 701 C499 706 468 750 470 807 C471 859 493 894 523 909 Q506 916 509 929 Q511 937 527 937 L584 937 Q602 937 602 922 L593 884 C587 861 596 848 604 822 C619 778 594 714 559 704 Q550 702 540 701 Z';
  const haunchR='M840 701 C881 706 912 750 910 807 C909 859 887 894 857 909 Q874 916 871 929 Q869 937 853 937 L796 937 Q778 937 778 922 L787 884 C793 861 784 848 776 822 C761 778 786 714 821 704 Q830 702 840 701 Z';
  return attachedTail(523,822,.96,-5,s,id)+body(torso,s,id)+body(haunchL,s,id)+body(haunchR,s,id)+patch('M690 525 C651 562 630 594 637 629 C643 661 670 698 690 722 C710 698 737 661 743 629 C750 594 729 562 690 525 Z',s,id)+limb('M615 708 C610 767 617 830 612 884 Q589 898 592 922 Q593 937 609 937 L655 937 Q672 937 672 922 L668 745 Z',s,id)+limb('M765 708 C770 767 763 830 768 884 Q791 898 788 922 Q787 937 771 937 L725 937 Q708 937 708 922 L712 745 Z',s,id)+frontFace(s,id);
}

export function naturalProfile({style:s='gradient',id='m',rear=false}={}) {
  if(rear)return backView(s,id);
  const torso='M625 452 C638 505 611 540 570 573 C513 616 459 656 438 713 C417 774 433 849 473 905 L635 915 C667 852 689 804 724 778 C785 733 822 682 839 631 C853 580 833 520 811 445 Z';
  const near='M750 643 C750 714 762 800 776 869 C803 872 822 891 820 921 Q820 933 806 933 L753 933 C738 933 731 924 728 911 C710 835 694 756 696 700 Z';
  const far='M793 611 C811 702 793 787 816 867 Q857 874 855 917 Q855 933 840 933 L801 933 Q780 933 775 912 L739 737 Z';
  return attachedTail(444,812,1,0,s,id)+body(torso,s,id)+limb(far,s,id,true)+patch('M768 519 C790 544 802 572 792 596 C785 615 772 637 757 651 C748 625 744 598 747 573 Q752 542 768 519 Z',s,id)+limb(near,s,id)+body(geometry.thigh,s,id)+patch(geometry.thighLight,s,id)+sideFace(s,id);
}

function backView(s,id) {
  // Both sides of the rump are visible; the tail emerges between the haunches.
  const torso='M596 449 C598 523 581 568 543 623 C500 681 478 752 484 813 C488 865 523 913 579 930 L801 930 C857 913 892 865 896 813 C902 752 880 681 837 623 C799 568 782 523 784 449 Z';
  const hd='M482 365 C511 344 521 317 526 277 L541 156 C545 126 551 115 562 115 C580 115 601 145 623 180 L650 221 Q690 212 730 221 L757 180 C779 145 800 115 818 115 C829 115 835 126 839 156 L854 277 C859 317 869 344 898 365 Q916 377 904 386 L887 393 Q908 403 890 415 C846 450 774 480 690 482 C606 480 534 450 490 415 Q472 403 493 393 L476 386 Q464 377 482 365 Z';
  return attachedTail(535,825,.96,-5,s,id)+limb('M574 689 L559 882 Q537 895 539 921 Q539 936 558 936 L609 936 L625 713 Z',s,id,true)+limb('M806 689 L821 882 Q843 895 841 921 Q841 936 822 936 L771 936 L755 713 Z',s,id,true)+body(torso,s,id)+body('M557 724 C509 748 505 835 537 879 Q507 890 509 919 Q510 937 533 937 L619 937 Q641 932 638 913 C611 872 596 805 612 772 Z',s,id)+body('M823 724 C871 748 875 835 843 879 Q873 890 871 919 Q870 937 847 937 L761 937 Q739 932 742 913 C769 872 784 805 768 772 Z',s,id)+shape(hd,'head',s,id,'data-part="head" data-view="back"');
}

function standing(s,id,walking=false) {
  const torso='M331 564 C333 512 377 477 430 480 C529 488 603 502 666 470 C711 446 734 416 752 394 L825 449 C850 500 843 558 822 599 C799 648 748 676 684 679 L485 663 C426 688 351 648 331 564 Z';
  const farHind=walking?'M404 589 C448 621 458 672 443 714 L471 759 L530 778 Q551 787 540 803 L512 819 Q501 825 488 817 L411 776 Q395 763 393 741 L369 645 Z':'M431 591 C470 637 477 686 454 733 L463 816 Q504 824 505 846 Q505 858 490 858 L442 858 Q425 858 423 843 L403 744 L381 662 Z';
  const farFront=walking?'M791 555 C804 626 784 683 756 720 L736 768 L690 786 Q674 790 676 808 Q680 825 695 825 L745 819 Q760 814 763 801 L781 755 C826 711 847 647 844 584 Z':'M793 549 C816 629 805 718 815 812 Q858 824 858 846 Q858 858 842 858 L796 858 Q780 858 777 841 L758 618 Z';
  const hind=walking?'M378 554 C423 545 461 583 454 628 C450 665 421 690 398 711 L355 771 L309 823 Q339 826 337 846 Q337 859 321 859 L267 859 Q249 855 256 838 L311 741 L344 661 C319 613 337 566 378 554 Z':'M378 554 C423 545 461 583 454 628 C450 665 424 689 401 711 L392 800 L418 821 Q453 824 453 846 Q453 860 437 860 L382 860 Q363 860 362 842 L357 764 L363 706 C322 664 322 577 378 554 Z';
  const fore=walking?'M724 568 C751 586 758 621 774 670 L814 761 L862 822 Q904 823 908 846 Q909 860 891 860 L845 860 Q831 860 822 845 L749 772 L702 663 Z':'M719 565 C746 577 759 607 750 654 L743 814 Q783 820 785 846 Q786 860 770 860 L718 860 Q701 860 700 844 L692 652 Z';
  return attachedTail(368,556,.53,walking?-63:-53,s,id)+limb(farHind,s,id,true)+limb(farFront,s,id,true)+body(torso,s,id)+patch('M767 459 C804 486 814 522 802 560 C790 599 764 630 738 651 C729 613 728 571 735 532 C741 497 753 472 767 459 Z',s,id)+limb(hind,s,id)+limb(fore,s,id)+face(790,434,.72,s,id,{angle:walking?2:0});
}

function sniffing(s,id) {
  return attachedTail(378,568,.54,-53,s,id)+limb('M412 613 L446 714 L451 822 Q489 830 488 850 Q488 862 475 862 L429 862 Q413 862 409 844 L388 728 L364 647 Z',s,id,true)+limb('M783 647 L819 824 Q857 831 856 850 Q856 862 841 862 L800 862 Q784 862 780 844 L737 672 Z',s,id,true)+body('M336 562 C342 510 385 484 435 491 C539 504 596 531 659 552 C711 568 756 578 801 613 L831 707 C781 716 734 705 682 687 L495 671 C429 694 349 646 336 562 Z',s,id)+patch('M751 602 C783 618 800 642 800 668 C800 705 772 738 746 755 C738 720 733 688 732 658 Q733 627 751 602 Z',s,id)+limb('M382 556 C429 549 468 585 461 631 C457 666 429 697 402 718 L386 825 Q425 831 426 850 Q426 864 410 864 L367 864 Q350 864 350 847 L354 710 C316 661 330 572 382 556 Z',s,id)+limb('M704 650 C740 666 747 698 749 737 L732 828 Q775 832 777 852 Q777 864 760 864 L708 864 Q694 864 694 847 L687 737 Z',s,id)+face(754,735,.70,s,id,{angle:50,view:'profile'});
}

function stretching(s,id) {
  return attachedTail(376,496,.61,-23,s,id)+limb('M418 536 C458 568 465 637 450 702 L469 868 Q508 877 509 898 Q509 911 493 911 L448 911 Q431 911 429 893 L405 730 L378 599 Z',s,id,true)+limb('M660 655 C700 701 730 759 770 800 L907 859 Q936 867 934 887 Q934 899 918 899 L867 891 L717 835 C684 806 651 766 626 722 Z',s,id,true)+body('M332 488 C343 430 391 410 440 430 C494 454 531 500 570 556 C612 618 666 654 743 677 L780 758 C709 778 645 748 599 704 C545 653 500 612 449 601 C404 627 345 584 332 488 Z',s,id)+limb('M376 475 C422 455 460 493 451 542 C444 580 422 606 401 633 L375 748 L344 872 Q379 880 379 900 Q379 913 362 913 L309 913 Q291 913 296 895 L327 743 L346 629 C315 581 327 500 376 475 Z',s,id)+patch('M713 678 C748 687 773 711 779 734 C774 770 755 790 727 807 C704 785 685 760 680 730 Q684 698 713 678 Z',s,id)+limb('M659 709 C689 729 716 773 750 819 L913 878 Q957 880 960 901 Q961 917 942 917 L891 913 L722 864 C687 839 645 797 626 754 Z',s,id)+face(817,756,.69,s,id,{angle:10,expression:'satisfeito'});
}

function crouching(s,id) {
  return attachedTail(353,651,.53,-54,s,id)+limb('M379 660 L457 726 L482 799 Q521 806 521 824 Q521 836 505 836 L461 836 L404 766 L348 717 Z',s,id,true)+limb('M777 663 L825 755 L884 801 Q916 806 915 825 Q915 838 899 838 L859 838 L778 785 L733 721 Z',s,id,true)+body('M322 626 C335 551 393 522 470 535 C562 546 625 560 694 546 L793 569 C835 605 837 658 800 696 C752 735 674 739 605 722 L450 728 C380 740 322 696 322 626 Z',s,id)+patch('M770 578 C800 596 803 627 792 656 C781 687 757 712 728 726 C725 693 728 657 738 626 Q751 589 770 578 Z',s,id)+limb('M386 605 C433 600 478 647 462 689 C453 713 424 734 403 745 L440 788 L493 814 Q510 830 492 844 L449 844 Q434 842 423 828 L359 773 C335 748 323 712 335 674 C343 641 359 616 386 605 Z',s,id)+limb('M711 663 C738 681 751 713 746 745 L776 781 L841 817 Q858 830 844 844 L803 844 Q790 844 780 834 L714 786 Q695 769 690 746 L676 698 Z',s,id)+face(800,601,.71,s,id,{angle:4});
}

function lying(s,id) {
  return attachedTail(390,741,.51,-59,s,id)+body('M331 734 C332 651 394 594 475 599 C569 603 610 625 676 628 C720 615 777 637 800 684 C838 748 800 811 734 828 L430 839 C362 839 323 795 331 734 Z',s,id)+limb('M752 716 C790 738 817 769 829 794 L883 806 Q927 810 927 834 Q927 849 909 849 L793 842 L721 794 Z',s,id,true)+limb('M679 738 C710 753 734 787 746 818 L812 835 Q858 836 862 861 Q864 879 844 879 L746 879 C701 873 659 850 635 820 Z',s,id)+body('M402 679 C449 653 501 687 503 737 C506 779 477 807 447 823 Q495 823 499 850 Q500 865 481 865 L388 865 Q359 863 348 840 C324 786 343 712 402 679 Z',s,id)+patch('M754 661 C787 679 798 700 788 732 C778 766 750 790 723 800 C714 768 714 737 724 708 Q735 677 754 661 Z',s,id)+face(785,682,.71,s,id,{angle:-5});
}

export function sleeping({style:s='gradient',id='m'}={}) {
  const torso='M280 709 C279 608 357 532 476 525 C595 518 707 568 762 652 C793 700 798 764 768 803 C716 863 606 890 490 881 C365 880 277 826 280 709 Z';
  const curl='M327 655 C275 667 246 716 252 765 C259 859 360 916 496 921 C631 926 768 899 829 834 C868 792 863 733 823 709 C784 687 744 702 731 735 C777 733 785 765 753 788 C699 828 601 847 506 840 C401 835 343 784 346 731 C349 701 354 670 327 655 Z';
  const tip='M731 735 C744 702 784 687 823 709 C863 733 868 792 829 834 C810 854 786 870 759 882 C764 859 758 844 739 837 Q717 828 732 813 C741 804 748 797 753 788 C785 765 777 733 731 735 Z';
  return body(torso,s,id)+limb('M647 765 Q691 742 735 770 L769 807 Q782 827 758 837 L661 842 Q627 832 624 810 Z',s,id)+face(650,750,.68,s,id,{angle:10,expression:'satisfeito'})+shape(curl,'tail',s,id,'data-part="tail" data-joint="tail-root"')+patch(tip,s,id);
}

function jumping(s,id) {
  return attachedTail(378,551,.54,-55,s,id)+limb('M389 618 C424 639 451 670 450 701 L421 739 L467 763 Q485 772 479 788 Q473 803 458 795 L393 771 Q373 762 377 744 L392 710 L352 664 Z',s,id,true)+limb('M734 585 C763 618 774 649 767 680 L809 705 Q825 716 815 731 Q805 743 791 734 L731 708 Q716 701 718 681 L702 628 Z',s,id,true)+body('M325 548 C334 490 381 466 438 481 C521 502 572 526 639 501 L745 447 C801 451 835 494 829 546 C822 606 774 645 713 658 L491 672 C406 688 334 638 325 548 Z',s,id)+patch('M769 466 C800 492 805 529 786 565 C771 595 741 622 713 638 C712 601 718 563 731 529 Q745 487 769 466 Z',s,id)+limb('M375 556 C415 539 458 570 458 610 C458 649 430 680 400 696 L360 723 L311 731 Q291 733 290 716 Q289 700 306 694 L350 680 L365 658 C322 641 329 579 375 556 Z',s,id)+limb('M701 575 C728 591 737 619 732 646 L705 690 L739 733 Q750 751 734 760 Q718 769 706 751 L669 709 Q658 696 666 680 L679 624 Z',s,id)+face(791,462,.72,s,id,{angle:-5});
}

function lookingBack(s,id) {
  return attachedTail(435,813,.98,0,s,id)+body('M554 459 C548 520 546 558 495 617 C439 678 408 766 447 854 L500 917 L684 922 C755 861 800 787 800 704 C796 631 737 548 731 448 Z',s,id)+limb('M712 657 C743 710 731 805 746 875 Q784 881 786 915 Q786 934 768 934 L723 934 Q705 934 703 913 L664 740 Z',s,id,true)+limb('M638 686 C665 742 663 819 676 877 Q714 884 714 916 Q714 934 696 934 L650 934 Q633 934 629 914 L589 745 Z',s,id)+body(geometry.thigh,s,id)+patch(geometry.thighLight,s,id)+face(610,431,.93,s,id,{mirror:true,angle:-6,view:'profile'});
}

export const poseViewBoxes={
  "sentada": "45 22 954 969",
  "em-pe": "-47 124 1068 795",
  "caminhando": "-59 126 1082 793",
  "farejando": "-44 323 1075 600",
  "espreguicando": "3 92 1046 884",
  "agachada": "-63 299 1096 604",
  "deitada": "-19 371 1026 567",
  "dormindo": "191 461 724 520",
  "saltando": "-47 147 1062 710",
  "olhando-para-tras": "66 65 793 928"
};
export function naturalPose(kind,{style:s='gradient',id='m'}={}) {
  const draw={sentada:()=>seated({style:s,id}),'em-pe':()=>standing(s,id),caminhando:()=>standing(s,id,true),farejando:()=>sniffing(s,id),espreguicando:()=>stretching(s,id),agachada:()=>crouching(s,id),deitada:()=>lying(s,id),dormindo:()=>sleeping({style:s,id}),saltando:()=>jumping(s,id),'olhando-para-tras':()=>lookingBack(s,id)}[kind];
  if(!draw)throw new Error('Pose desconhecida: '+kind);
  return `<g data-pose="${kind}">${draw()}</g>`;
}

function sideFace(s,id) {
  const hd='M542 355 C564 328 570 292 577 239 L592 151 Q595 125 607 128 C624 132 645 170 667 201 Q695 193 721 196 L766 101 Q778 80 791 103 C807 129 820 178 833 228 C845 265 850 292 867 313 C885 333 916 341 947 343 Q964 345 953 359 C935 378 904 388 873 389 C828 435 775 474 707 477 C647 479 593 456 558 434 Q541 426 555 416 Q526 408 547 397 Q524 385 547 373 Q531 367 542 355 Z';
  const mk='M547 373 C585 361 631 383 681 410 C710 420 741 382 771 369 C800 355 830 352 852 352 C878 356 911 348 947 343 Q964 345 953 359 C935 378 904 388 873 389 C828 435 775 474 707 477 C647 479 593 456 558 434 Q541 426 555 416 Q526 408 547 397 Q524 385 547 373 Z';
  let f=shape(hd,'head',s,id)+patch(mk,s,id);
  if(!plain(s))f+=`<ellipse data-feature="eye" cx="807" cy="322" rx="17" ry="29" transform="rotate(-9 807 322)" fill="#000000"/><ellipse cx="803" cy="312" rx="6" ry="8" fill="#FFFFFF"/><ellipse cx="951" cy="348" rx="13" ry="9" fill="${palette.purple}"/>`;
  return `<g data-part="head" data-view="profile">${f}</g>`;
}
