import { Tag } from "../../models/Tag";

interface Props {
  tags: Tag[];
}

const NotesFormTags: React.FC<Props> = (props) => (
  <div className="tags">
    {props.tags.map(({ name }, key) => (
      <div className="tag" key={key}>
        {name}
      </div>
    ))}
  </div>
);

export default NotesFormTags;
