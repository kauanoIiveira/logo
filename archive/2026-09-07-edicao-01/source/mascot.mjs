// Native vector construction of the user's approved mascot.
// Coordinates follow the large character in the approved 1536 × 1024 sheet.
export const palette = {
  orange: '#FF8B08', gold: '#FFC326', coral: '#FF5936', purple: '#2B0B49',
  violet: '#64238D', ivory: '#FFF8EE', white: '#FFFFFF'
};

export const geometry = {
  head: 'M486 367 C514 350 521 316 526 275 L541 155 C543 130 548 114 561 114 C576 109 594 133 620 159 L659 211 C679 205 697 204 718 202 C735 161 753 117 772 94 C783 80 791 80 801 89 C820 106 840 159 851 213 C862 265 873 292 910 301 C929 305 929 315 911 326 C934 326 950 335 930 347 L912 357 C938 360 944 368 925 381 C902 397 883 411 863 431 C827 468 766 482 702 484 C635 486 579 472 535 455 C518 448 504 439 495 437 C480 434 494 422 508 414 C485 411 474 408 479 398 C482 390 492 385 502 381 C484 378 480 373 486 367 Z',
  mask: 'M502 383 C540 373 585 396 633 420 C645 423 658 391 678 376 C700 358 718 361 741 374 L784 398 C818 375 875 339 910 328 C933 324 950 334 931 346 L912 357 C937 360 944 368 925 381 C902 397 883 411 863 431 C827 468 766 482 702 484 C635 486 579 472 535 455 C518 448 504 439 495 437 C480 434 494 422 508 414 C485 411 474 408 479 398 C482 390 492 385 502 383 Z',
  tail: 'M419 791 C359 748 369 659 409 578 C453 490 476 400 437 306 C410 237 369 193 296 174 C229 156 179 175 146 205 C123 226 111 246 106 264 C102 278 118 270 136 271 C208 264 244 317 215 411 C190 492 146 554 135 625 C122 705 143 790 191 839 C247 895 327 913 426 891 Z',
  tip: 'M106 264 C111 246 123 226 146 205 C179 175 229 156 296 174 C369 193 410 237 437 306 C447 330 452 356 455 381 C429 361 399 338 383 333 C374 330 373 341 371 354 C366 379 353 413 339 428 C330 437 323 431 315 417 C293 381 281 339 239 306 C207 281 174 268 136 271 C118 270 102 278 106 264 Z',
  torso: 'M595 463 C604 506 603 528 571 552 C531 583 474 625 441 669 C405 718 404 800 444 861 L486 909 L630 912 C661 859 673 817 712 786 C773 740 814 691 836 639 C858 586 839 523 815 454 C753 485 666 494 595 463 Z',
  farLeg: 'M798 606 C810 695 777 783 794 872 C820 875 837 890 837 917 C837 930 831 932 818 932 L775 932 C759 932 749 926 744 910 C735 878 721 834 712 790 L708 742 Z',
  chest: 'M745 518 C758 516 779 540 791 564 C821 632 794 705 712 792 C704 742 704 697 695 650 C682 595 697 554 726 530 C733 524 739 520 745 518 Z',
  nearLeg: 'M620 632 C656 659 672 688 690 747 C704 793 712 837 725 872 C747 878 760 893 760 916 C760 929 752 932 739 932 L702 932 C684 932 676 925 671 910 C646 843 635 782 617 729 Z',
  thigh: 'M484 690 C504 675 525 668 548 673 C596 685 626 727 630 780 C634 822 611 850 590 872 C620 866 649 887 653 913 C656 930 646 932 630 932 L489 932 C471 932 459 918 448 895 C423 844 410 800 420 755 C429 722 455 704 484 690 Z',
  thighLight: 'M523 671 C572 668 615 709 627 754 C636 790 627 824 610 846 C625 814 628 785 623 758 C613 715 568 682 523 671 Z',
};

export const expressions = [
  ['neutro','Neutro'], ['curioso','Curioso'], ['feliz','Feliz'], ['pensando','Pensando'],
  ['alerta','Alerta'], ['satisfeito','Satisfeito'], ['frustracao','Leve frustração'], ['comemorando','Comemorando']
];
export const poses = [
  ['indicando','Indicando informação'], ['observando','Observando'], ['analisando','Analisando dados'],
  ['notificacao','Olhando notificação'], ['sucesso','Sucesso'], ['erro','Erro leve'],
  ['aguardando','Aguardando'], ['celebrando','Celebrando'], ['ajudando','Ajudando'], ['descansando','Descansando']
];

export function defs(id='m') {
  const g=(n,x1,y1,x2,y2,stops)=>`<linearGradient id="${id}-${n}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o,c])=>`<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
  return g('head',700,83,700,484,[[0,'#FF4146'],[.25,'#FF7403'],[.6,'#FF9507'],[1,'#FFAB11']])+g('body',640,454,640,940,[[0,'#FF990B'],[.55,'#FF960A'],[1,'#FF7815']])+g('tail',265,174,330,906,[[0,'#FFB00C'],[.3,'#FF9905'],[.7,'#FF8611'],[1,'#FF6720']])+g('tip',250,167,350,430,[[0,'#FFB311'],[1,'#FFB920']])+g('gold',650,325,700,790,[[0,'#FFCB26'],[1,'#FFBA20']])+g('eye',620,294,640,378,[[0,'#65218A'],[.5,'#3B0B65'],[1,'#220744']]);
}

function fill(kind,style,id) { return style==='silhouette'||style==='mono'?'#2B0B49':style==='black'?'#101010':style==='reverse'?'#FFFFFF':style==='solid'?({head:palette.orange,body:palette.orange,tail:palette.orange,tip:palette.gold,gold:palette.gold,eye:palette.purple}[kind]):`url(#${id}-${kind})`; }
function path(d,kind,style,id,extra=''){return `<path d="${d}" fill="${fill(kind,style,id)}" ${extra}/>`;}
function eye(cx,cy,rx,ry,closed,style,id,angle=-9){
  if(closed) {
    const bend=closed==='feliz'?-16:closed==='comemorando'?-21:6;
    return `<path d="M${cx-rx} ${cy-2} Q${cx} ${cy+bend} ${cx+rx} ${cy-2}" fill="none" stroke="${palette.purple}" stroke-width="6" stroke-linecap="round"/>`;
  }
  return `<g transform="rotate(${angle} ${cx} ${cy})"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill('eye',style,id)}"/><ellipse cx="${cx-4}" cy="${cy-Math.min(10,ry*.32)}" rx="${Math.min(7,ry*.3)}" ry="${Math.min(8,ry*.27)}" fill="#FFFFFF"/></g>`;
}

export function head({expression='neutro',style='gradient',id='m',rotate=0,view='main'}={}) {
  const plain=['silhouette','black','reverse'].includes(style);
  let mask=path(geometry.mask,'gold',style,id);
  let features='';
  if(!plain){
    const closed=['feliz','satisfeito','comemorando'].includes(expression)?expression:false;
    const sleepy=expression==='frustracao';
    const thinking=expression==='pensando';
    const ey=expression==='alerta'?1.05:sleepy?.5:thinking?.78:1;
    features=eye(627,347,20,31*ey,closed,style,id)+eye(774,325,19,31*ey,closed,style,id);
    features+=`<ellipse cx="701" cy="393" rx="20" ry="13" transform="rotate(-12 701 393)" fill="${palette.purple}"/>`;
    if(style==='mono'){mask=`<path d="${geometry.mask}" fill="#FFF8EE"/>`;}
  }
  const shape=path(geometry.head,'head',style,id)+(plain?'':mask+features);
  if(view==='front') return `<g transform="rotate(8.5 701 393)">${shape}</g>`;
  return `<g data-part="head" data-expression="${expression}" transform="rotate(${rotate} 701 430)">${shape}</g>`;
}

export function tail({style='gradient',id='m',transform=''}={}) {return `<g data-part="tail" transform="${transform}">${path(geometry.tail,'tail',style,id)}${['silhouette','black','reverse'].includes(style)?'':path(geometry.tip,'tip',style,id)}</g>`;}

export function seated({style='gradient',id='m',expression='neutro',rotate=0,gesture='',tailTransform=''}={}) {
  if(style==='mono')return `<defs><mask id="${id}-knockout" maskUnits="userSpaceOnUse" x="50" y="50" width="960" height="940"><rect x="50" y="50" width="960" height="940" fill="white"/><path d="${geometry.mask}" fill="black"/><path d="${geometry.chest}" fill="black"/><path d="${geometry.tip}" fill="black"/><ellipse cx="627" cy="347" rx="20" ry="31" transform="rotate(-9 627 347)" fill="black"/><ellipse cx="774" cy="325" rx="19" ry="31" transform="rotate(-9 774 325)" fill="black"/></mask></defs><g mask="url(#${id}-knockout)">${seated({style:'silhouette',id})}</g><ellipse cx="701" cy="393" rx="20" ry="13" transform="rotate(-12 701 393)" fill="${palette.purple}"/>`;
  const plain=['silhouette','black','reverse'].includes(style);
  const arm=gesture?path('M708 680 C735 669 747 644 764 620 L851 539 C866 528 887 534 887 549 C887 561 877 570 866 577 L791 664 C777 697 757 720 731 735 Z','body',style,id):path(geometry.nearLeg,'body',style,id);
  return tail({style,id,transform:tailTransform})+path(geometry.torso,'body',style,id)+path(geometry.farLeg,'body',style,id)+(plain?'':path(geometry.chest,'gold',style,id))+arm+path(geometry.thigh,'body',style,id)+(plain?'':path(geometry.thighLight,'gold',style,id))+head({style,id,expression,rotate});
}

export function profile({style='gradient',id='m',rear=false}={}) {
  const plain=['silhouette','black','reverse'].includes(style);
  const hd=rear?'M548 210 L551 134 Q554 103 574 125 L639 194 Q696 170 747 192 L793 99 Q808 72 824 100 L853 204 C890 237 900 315 881 370 C869 416 827 451 759 460 C690 465 619 439 582 396 C544 351 526 280 548 210 Z':'M565 300 C569 262 591 231 627 213 L647 127 Q657 105 674 129 L698 188 L741 93 Q751 78 764 98 L805 206 C833 230 846 276 833 315 C844 333 884 345 913 342 Q938 338 932 353 C919 376 886 388 857 390 C820 428 775 454 717 456 C653 459 601 436 577 390 C560 358 559 329 565 300 Z';
  let h=path(hd,'head',style,id);
  if(!rear&&!plain)h+=path('M573 355 C621 333 663 363 702 365 C751 366 791 344 824 337 C852 349 886 345 913 342 Q938 338 932 353 C919 376 886 388 857 390 C820 428 775 454 717 456 C653 459 601 436 577 390 Z','gold',style,id)+eye(800,308,17,28,false,style,id)+`<ellipse cx="921" cy="349" rx="13" ry="9" fill="${palette.purple}"/>`;
  const profileTorso='M638 425 C641 491 616 528 582 558 C535 594 474 635 441 669 C405 718 404 800 444 861 L486 909 L630 912 C661 859 673 817 712 786 C773 740 814 691 836 639 C858 586 829 510 815 425 Z';
  return tail({style,id,transform:rear?'translate(16 0)':''})+path(profileTorso,'body',style,id)+path(geometry.farLeg,'body',style,id)+(plain||rear?'':path(geometry.chest,'gold',style,id))+path(geometry.nearLeg,'body',style,id)+path(geometry.thigh,'body',style,id)+(plain?'':path(geometry.thighLight,'gold',style,id))+h;
}

export function front({style='gradient',id='m'}={}) {
  const plain=['silhouette','black','reverse'].includes(style);
  const body='M576 438 C573 520 554 580 539 656 C523 739 531 812 556 874 Q535 895 540 920 Q540 932 554 932 L657 932 Q678 932 678 914 L678 745 L701 745 L705 914 Q705 932 723 932 L826 932 Q843 932 840 914 Q838 892 819 875 C844 804 846 722 830 653 L804 438 Z';
  const patch='M690 511 C734 542 759 592 758 647 C756 709 727 754 691 794 C657 752 626 709 625 647 C624 591 649 540 690 511 Z';
  return tail({style,id})+path(body,'body',style,id)+(plain?'':path(patch,'gold',style,id))+head({style,id,view:'front'});
}

export function resting({style='gradient',id='m',expression='satisfeito'}={}) {
  const body='M321 682 C335 599 414 550 513 560 C626 565 718 606 771 677 C818 740 814 814 773 851 C738 881 650 895 554 884 L344 882 C238 877 233 761 321 682 Z';
  const curl='M260 744 C231 672 206 635 155 635 C96 636 70 675 88 708 C115 693 157 709 165 744 C182 833 270 913 397 917 C524 925 679 902 721 858 C747 831 726 806 689 814 C532 863 345 840 260 744 Z';
  return path(body,'body',style,id)+`<g transform="translate(119 388) scale(.8)">${head({style,id,expression,rotate:12})}</g>`+path(curl,'tail',style,id)+(['silhouette','black','reverse'].includes(style)?'':path('M88 708 C70 675 96 636 155 635 C202 635 231 671 252 725 C230 717 219 718 206 733 C193 748 180 750 165 744 C157 709 115 693 88 708 Z','tip',style,id));
}

export function symbol({style='gradient',id='m',micro=false}={}) {
  // Reduction reuses the master's outline and mask. Small sizes omit gradients/highlights.
  const mono=['mono','silhouette','black','reverse'].includes(style);
  let s=`<path d="${geometry.head}" fill="${mono?fill('head',style,id):palette.orange}"/>`;
  if(!['silhouette','black','reverse'].includes(style))s+=`<path d="${geometry.mask}" fill="${style==='mono'?palette.ivory:palette.gold}"/><ellipse cx="627" cy="347" rx="${micro?22:20}" ry="31" transform="rotate(-9 627 347)" fill="${palette.purple}"/><ellipse cx="774" cy="325" rx="${micro?21:19}" ry="31" transform="rotate(-9 774 325)" fill="${palette.purple}"/><ellipse cx="701" cy="393" rx="20" ry="13" transform="rotate(-12 701 393)" fill="${palette.purple}"/>`;
  return `<g transform="translate(-61.8 -5) scale(.132)">${s}</g>`;
}

function auxiliary(kind){
  const stroke=`stroke="${palette.purple}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"`;
  if(kind==='analisando')return `<g transform="translate(940 390)"><rect width="175" height="128" rx="18" fill="${palette.ivory}" ${stroke}/><path d="M30 93 L61 67 L90 81 L143 35" fill="none" ${stroke}/></g>`;
  if(kind==='notificacao')return `<g transform="translate(995 240)"><path d="M0 44 Q0 0 35 0 Q70 0 70 44 L78 65 L-8 65 Z" fill="${palette.gold}"/><circle cx="35" cy="80" r="10" fill="${palette.gold}"/><circle cx="70" cy="0" r="13" fill="${palette.coral}"/></g>`;
  if(kind==='sucesso')return `<path d="M990 327 L1014 350 L1062 291" fill="none" stroke="${palette.purple}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
  if(kind==='erro')return `<g transform="translate(1025 340)"><circle r="32" fill="${palette.gold}"/><path d="M0 -14 V5" ${stroke}/><circle cy="18" r="4" fill="${palette.purple}"/></g>`;
  if(kind==='ajudando')return `<g transform="translate(985 395)"><path d="M0 15 Q45 -5 85 13 V115 Q48 98 0 118 Z" fill="${palette.ivory}" ${stroke}/><path d="M22 39 H62 M22 60 H57 M22 81 H47" ${stroke}/></g>`;
  return '';
}

export function pose(kind,{style='gradient',id='m'}={}){
  if(kind==='descansando')return resting({style,id});
  const config={indicando:['neutro',-5,true],observando:['neutro',9,false],analisando:['pensando',-5,true],notificacao:['alerta',-10,false],sucesso:['feliz',0,false],erro:['frustracao',8,false],aguardando:['neutro',3,false],celebrando:['comemorando',-8,true],ajudando:['curioso',-5,true]}[kind]||['neutro',0,false];
  let s=seated({style,id,expression:config[0],rotate:config[1],gesture:config[2]?'raise':'',tailTransform:kind==='aguardando'?'rotate(-7 416 791)':kind==='celebrando'?'rotate(5 416 791)':''});
  if(kind==='celebrando')s=`<g transform="translate(0 -35)">${s}</g>`;
  return s+auxiliary(kind);
}

export function svg(content,{viewBox='60 55 940 930',id='m',title='Mascote raposa',width=940,height=930,bg=null}={}){
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${width}" height="${height}" role="img" aria-labelledby="${id}-title"><title id="${id}-title">${title}</title><defs>${defs(id)}</defs>${bg?`<rect x="${viewBox.split(' ')[0]}" y="${viewBox.split(' ')[1]}" width="${viewBox.split(' ')[2]}" height="${viewBox.split(' ')[3]}" fill="${bg}"/>`:''}${content}</svg>`;
}
