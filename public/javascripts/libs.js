function whichTransitionEvent(){

    var t;
    var el = document.createElement('fakeelement');

    var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd',
      'MsTransition':'msTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}

//加载DISQUS
var disqus_shortname = 'byzhewang';
var disqus_identifier; //made of post id and guid
var disqus_title;
var disqus_url; //post permalink
var prevSource;

function loadDisqus(source, identifier, url, title) {

    console.log(title);

    if(window.DISQUS){

            if($('#disqus_thread')[0]){
                $('#disqus_thread').appendTo(source);
            }else{
                $('<div id="disqus_thread"></div>').appendTo(source);
            }

           DISQUS.reset({
                reload: true,
                config: function () {
                      this.page.identifier = identifier;
                      this.page.url = url;
                      this.page.title = title;
                }
            });

            if(prevSource.attr('data-article-id') != source.attr('data-article-id')){
                prevSource.trigger('disqus_did_remove');
            }

    }else{

       //insert a wrapper in HTML after the relevant "show comments" link
       $('<div id="disqus_thread"></div>').appendTo(source);
       disqus_identifier = identifier; //set the identifier argument
       disqus_url = url; //set the permalink argument
       disqus_title = title;

       //append the Disqus embed script to HTML
       var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
       dsq.src = 'https://' + disqus_shortname + '.disqus.com/embed.js';
       $('head').append(dsq);

    }

    prevSource = source;
};
