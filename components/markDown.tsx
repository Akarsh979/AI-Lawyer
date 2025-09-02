import markdownit from 'markdown-it';
import DOMPurify from 'dompurify';

const md = markdownit();

type Props = {
   content: string
}

const Markdown = ({content}: Props) => {
  const html = md.render(content); 
  const purifiedHTML = DOMPurify.sanitize(html); 
  return (
    <div dangerouslySetInnerHTML={{__html: purifiedHTML}}></div>
  )
}

export default Markdown;