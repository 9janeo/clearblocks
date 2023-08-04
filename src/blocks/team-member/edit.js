import { 
  useBlockProps, InspectorControls, RichText, MediaPlaceholder, BlockControls, MediaReplaceFlow
} from '@wordpress/block-editor';
import { 
  PanelBody, TextareaControl, Spinner, ToolbarButton, Tooltip, Icon,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { isBlobURL, revokeBlobURL } from '@wordpress/blob';
import { useState } from '@wordpress/element';

export default function ({ attributes, setAttributes, context, isSelected }) {
  const { 
    name, title, bio, imgID, imgAlt, imgURL, socialHandles
  } = attributes;

  const blockProps = useBlockProps();

  const [imgPreview, setImgPreview] = useState(imgURL)

  const selectImg = (img) => {
    let newImgURL = null
    if (isBlobURL(img.url)){
      newImgURL = img.url
    } else {
      newImgURL = img.sizes ? img.sizes.teamMember.url : img.media_details.sizes.teamMember.source_url
      setAttributes({
        imdID: img.id,
        imgAlt: img.alt,
        imgURL: newImgURL
      })
      revokeBlobURL(imgPreview)
    }
    setImgPreview(newImgURL)
  }

  const selectImgUrl = (url) => {
    setAttributes({
      imdID: null,
      imgAlt: null,
      imgURL: url
    });

    setImgPreview(url);
  }

  const imageClass = `wp-image-${imgID} img-${context["clearblocks/image-shape"]}`;

  return (
    <>
      {imgPreview && (
        <BlockControls group="inline">
          <MediaReplaceFlow 
            name= {__('Replace Image', 'cc-clearblocks')}
            mediaId={imgID}
            mediaURL={imgURL}
            allowedTypes={['image']}
            accept={'image/*'}
            onError={error => console.erorr(error)}
            onSelect={selectImg}
            onSelectURL={selectImgUrl}
          />
          <ToolbarButton 
            onClick={()=> {
              setAttributes({
                imgID: 0,
                imgAlt: "",
                imgURL: ""
              });

              setImgPreview("");
            }}
          >
            {__('Remove Image', 'cc-clearblocks')}
          </ToolbarButton>
        </BlockControls>
      )}
      <InspectorControls>
        <PanelBody title={__('Settings', 'cc-clearblocks')}>
          {
            imgPreview && !isBlobURL(imgPreview) &&
            <TextareaControl 
              label={__('Alt Attribute', 'cc-clearblocks')}
              value={imgAlt}
              onChange={imgAlt => setAttributes({imgAlt})}
              help={__(
                'Description of your image for screen readers.',
                'cc-clearblocks'
              )}
            />
          }
        </PanelBody>
      </InspectorControls>
      <div {...blockProps}>
        <div className="author-meta">
          { imgPreview && <img src={imgPreview} alt={imgAlt} className={imageClass}/> }
          { isBlobURL(imgPreview) && <Spinner /> }
          <MediaPlaceholder 
            allowedTypes={['image']}
            accept={'image/*'}
            icon="admin-users"
            onSelect={selectImg}
            onError={error => console.error(error)}
            disableMediaButtons={imgPreview}
            onSelectURL={selectImgUrl}
          /> 
          <p>
            <RichText 
              placeholder={__('Name', 'cc-clearblocks')}
              tagName="strong"
              onChange={name => setAttributes({name})}
              value={name}
            />
            <RichText 
              placeholder={__('Title', 'cc-clearblocks')}
              tagName="span"
              onChange={title => setAttributes({title})}
              value={title}
            />
          </p>
        </div>
        <div className="member-bio">
          <RichText 
            placeholder={__('Member bio', 'cc-clearblocks')}
            tagName="p"
            onChange={bio => setAttributes({bio})}
            value={bio}
          />
        </div>
        <div className="social-links">
          {
            socialHandles.map( (handle, index) => {
              return (
                <a href={handle.url} key={index}>
                  <i className={`bi bi-${handle.icon}`}></i>
                </a>
              )
            })
          }
          {
            isSelected &&
            <Tooltip text={__('Add Social Media Handle', 'cc-clearblocks')}>
              <a href='#' onClick={event => {
                event.preventDefault()
                setAttributes({
                  socialHandles: [...socialHandles, {
                    icon: "question",
                    url: "",
                  }],
                });
              }}>
                <Icon icon="plus" />
              </a>
              
            </Tooltip>
          }
        </div>
      </div>
    </>
  );
}