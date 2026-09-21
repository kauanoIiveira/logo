// Native vector construction of the user's approved mascot.
// Coordinates follow the large character in the approved 1536 × 1024 sheet.
export const palette = {
  orange: '#FF8B08', gold: '#FFC326', coral: '#FF5936', purple: '#2B0B49',
  black: '#000000', ivory: '#FFF8EE', white: '#FFFFFF'
};

export const geometry = {
  head: 'M486 367 C514 350 521 316 526 275 L541 155 C543 130 548 114 561 114 C576 109 594 133 620 159 L659 211 C679 205 697 204 718 202 C735 161 753 117 772 94 C783 80 791 80 801 89 C820 106 840 159 851 213 C862 265 873 292 910 301 C929 305 929 315 911 326 C934 326 950 335 930 347 L912 357 C938 360 944 368 925 381 C902 397 883 411 863 431 C827 468 766 482 702 484 C635 486 579 472 535 455 C518 448 504 439 495 437 C480 434 494 422 508 414 C485 411 474 408 479 398 C482 390 492 385 502 381 C484 378 480 373 486 367 Z',
  mask: 'M502 383 C540 373 585 396 633 420 C645 423 658 391 678 376 C700 358 718 361 741 374 L784 398 C818 375 875 339 910 328 C933 324 950 334 931 346 L912 357 C937 360 944 368 925 381 C902 397 883 411 863 431 C827 468 766 482 702 484 C635 486 579 472 535 455 C518 448 504 439 495 437 C480 434 494 422 508 414 C485 411 474 408 479 398 C482 390 492 385 502 383 Z',
  tail: 'M465 791 C359 748 369 659 409 578 C453 490 476 400 437 306 C410 237 369 193 296 174 C229 156 179 175 146 205 C123 226 111 246 106 264 C102 278 118 270 136 271 C208 264 244 317 215 411 C190 492 146 554 135 625 C122 705 143 790 191 839 C247 895 327 913 475 891 Z',
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
export const poses = []; // Rejected anatomy was withdrawn; new body studies are PNGs.

export function defs(id='m') {
  const g=(n,x1,y1,x2,y2,stops)=>`<linearGradient id="${id}-${n}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops.map(([o,c])=>`<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
  return g('head',700,83,700,484,[[0,'#FF4146'],[.25,'#FF7403'],[.6,'#FF9507'],[1,'#FFAB11']])+g('body',640,454,640,940,[[0,'#FF990B'],[.55,'#FF960A'],[1,'#FF7815']])+g('tail',265,174,330,906,[[0,'#FFB00C'],[.3,'#FF9905'],[.7,'#FF8611'],[1,'#FF6720']])+g('tip',250,167,350,430,[[0,'#FFB311'],[1,'#FFB920']])+g('gold',650,325,700,790,[[0,'#FFCB26'],[1,'#FFBA20']]);
}

function fill(kind,style,id) { return style==='silhouette'||style==='mono'?'#2B0B49':style==='black'?'#000000':style==='reverse'?'#FFFFFF':kind==='eye'?palette.black:style==='solid'?({head:palette.orange,body:palette.orange,tail:palette.orange,tip:palette.gold,gold:palette.gold}[kind]):`url(#${id}-${kind})`; }
function path(d,kind,style,id,extra=''){return `<path d="${d}" fill="${fill(kind,style,id)}" ${extra}/>`;}
function eye(cx,cy,rx,ry,closed,style,id,angle=-9){
  if(closed) {
    const bend=closed==='feliz'?-16:closed==='comemorando'?-21:6;
    return `<path data-feature="eye" d="M${cx-rx} ${cy-2} Q${cx} ${cy+bend} ${cx+rx} ${cy-2}" fill="none" stroke="${palette.black}" stroke-width="6" stroke-linecap="round"/>`;
  }
  return `<g transform="rotate(${angle} ${cx} ${cy})"><ellipse data-feature="eye" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill('eye',style,id)}"/><ellipse cx="${cx-4}" cy="${cy-Math.min(10,ry*.32)}" rx="${Math.min(7,ry*.3)}" ry="${Math.min(8,ry*.27)}" fill="#FFFFFF"/></g>`;
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

export function seated({style='gradient',id='m',expression='neutro',rotate=0}={}) {
  if(style==='mono')return `<defs><mask id="${id}-knockout" maskUnits="userSpaceOnUse" x="50" y="50" width="960" height="940"><rect x="50" y="50" width="960" height="940" fill="white"/><path d="${geometry.mask}" fill="black"/><path d="${geometry.chest}" fill="black"/><path d="${geometry.tip}" fill="black"/><ellipse cx="627" cy="347" rx="20" ry="31" transform="rotate(-9 627 347)" fill="black"/><ellipse cx="774" cy="325" rx="19" ry="31" transform="rotate(-9 774 325)" fill="black"/></mask></defs><g mask="url(#${id}-knockout)">${seated({style:'silhouette',id})}</g><ellipse cx="701" cy="393" rx="20" ry="13" transform="rotate(-12 701 393)" fill="${palette.purple}"/>`;
  const plain=['silhouette','black','reverse'].includes(style);
  return tail({style,id})+path(geometry.torso,'body',style,id)+path(geometry.farLeg,'body',style,id)+(plain?'':path(geometry.chest,'gold',style,id))+path(geometry.nearLeg,'body',style,id)+path(geometry.thigh,'body',style,id)+(plain?'':path(geometry.thighLight,'gold',style,id))+head({style,id,expression,rotate});
}


export function symbol({style='gradient',id='m',micro=false}={}) {
  // Reduction reuses the master's outline and mask. Small sizes omit gradients/highlights.
  const mono=['mono','silhouette','black','reverse'].includes(style);
  let s=`<path d="${geometry.head}" fill="${mono?fill('head',style,id):palette.orange}"/>`;
  if(!['silhouette','black','reverse'].includes(style))s+=`<path d="${geometry.mask}" fill="${style==='mono'?palette.ivory:palette.gold}"/><ellipse cx="627" cy="347" rx="${micro?22:20}" ry="31" transform="rotate(-9 627 347)" fill="${style==='mono'?palette.purple:palette.black}"/><ellipse cx="774" cy="325" rx="${micro?21:19}" ry="31" transform="rotate(-9 774 325)" fill="${style==='mono'?palette.purple:palette.black}"/><ellipse cx="701" cy="393" rx="20" ry="13" transform="rotate(-12 701 393)" fill="${palette.purple}"/>`;
  return `<g transform="translate(-61.8 -5) scale(.132)">${s}</g>`;
}


export function svg(content,{viewBox='60 55 940 930',id='m',title='Mascote raposa',width=940,height=930,bg=null}={}){
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${width}" height="${height}" role="img" aria-labelledby="${id}-title"><title id="${id}-title">${title}</title><defs>${defs(id)}</defs>${bg?`<rect x="${viewBox.split(' ')[0]}" y="${viewBox.split(' ')[1]}" width="${viewBox.split(' ')[2]}" height="${viewBox.split(' ')[3]}" fill="${bg}"/>`:''}${content}</svg>`;
}
