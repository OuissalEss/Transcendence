import { ChangeEvent, useState } from "react";
import { CiCamera, CiLock, CiUnlock } from "react-icons/ci";
import { IoIosAddCircleOutline, IoIosAddCircle } from "react-icons/io";
import { MdOutlineAddModerator, MdOutlineCheckCircle, MdOutlineCancel, MdAddModerator } from "react-icons/md";
import { admins, channelType, members } from "./utils/types";
import { useMutation } from '@apollo/client';
import { CREATE_CHANNEL, ADD_MEMBER, ADD_ADMIN } from "../../graphql/mutations";
import bcrypt from 'bcryptjs';
import { Cloudinary } from "@cloudinary/url-gen/index";
import ImageCompressor from 'image-compressor.js';


/**
 * simple way to make it real-time : emit the channels data to the server and then listen on it in discussion or chat and add it
 */

const NewRoom: React.FC<{
  channels: channelType[];
  setDisplay: React.Dispatch<React.SetStateAction<string>>;
  setChannels: React.Dispatch<React.SetStateAction<channelType[]>>;
}> = ({
  // channels,
  setDisplay,
  setChannels,
}) => {
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [title, setTitle] = useState('');
    const [pfp, setpfp] = useState('');
    const [description, setDescription] = useState('');
    const [passwordMismatch, setPasswordMismatch] = useState(false);
    const [addModerator, setAddModerator] = useState<string[]>([]);
    const [addMember, setAddMember] = useState<string[]>([]);
    const [createChannelMutation] = useMutation(CREATE_CHANNEL);
    const [addMemberMutation] = useMutation(ADD_MEMBER);
    const [addAdminMutation] = useMutation(ADD_ADMIN);
    const [lock, setLock] = useState(true);
    const [showPasswordContainer, setShowPasswordContainer] = useState(false);
    const friendsItems = JSON.parse(localStorage.getItem('friends') || '{}');
    const admins: admins = [];
    const members: members = [];

    const toggleLock = () => {
      setLock((prevState: any) => !prevState);
      setShowPasswordContainer(true);
      // console.log(lock + ' ha lock');
    };

    const handlePasswordSubmit = () => {
      console.log('Password submitted:', password);
      if (password !== password2) {
        console.log("unmatcha ed password");
        setPasswordMismatch(true);
        return;
      }
      setShowPasswordContainer(false);
      setPasswordMismatch(false);
    };

    const handlePasswordDiscard = () => {
      setShowPasswordContainer(false);
      setPassword('');
      // toggleLock();
    };

    const handleCreateChannel = async () => {
      if (!title) return;
      try {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const createChannelInput = {
          title: title,
          description: description || null,
          type: (lock ? "PUBLIC" : (password != '' ? "PROTECTED" : "PRIVATE")),
          password: hashedPassword || null,
          profileImage: pfp || '/Chat/chatBanner.png',
          ownerId: JSON.parse(localStorage.getItem('user') || '{}').id,
        };
        const { data } = await createChannelMutation({
          variables: { createChannelInput }
        });
        console.log(data);
        let channel: channelType = {
          id: data.createChannel.id,
          title: data.createChannel.title,
          description: data.createChannel.description,
          type: data.createChannel.type,
          password: data.createChannel.password,
          icon: data.createChannel.profileImage,
          updatedAt: data.createChannel.updatedAt,
          owner: {
            id: data.createChannel.owner.id,
            name: data.createChannel.owner.username,
            icon: data.createChannel.owner.avatar?.filename
          },
          admins: data.createChannel.admins.map((admin: any) => ({
            id: admin.id,
            name: admin.username,
            icon: admin.avatar?.filename
          })),
          members: data.createChannel.members.map((member: any) => ({
            id: member.id,
            name: member.username,
            icon: member.avatar?.filename,
            status: member.status,
            xp: member.xp,
            blocked: member.blocked.map((blocker: { blockedUserId: string }) => blocker.blockedUserId),
            blocken: member.blocking.map((blocking: { blockerId: string }) => blocking.blockerId)
          })),
          banned: data.createChannel.banned.map((banned: { id: string, username: string, avatar: { filename: string } }) => ({
            id: banned.id,
            name: banned.username,
            icon: banned.avatar?.filename
          })),
          muted: data.createChannel.muted.map((muted: any) => ({
            id: muted.id,
            name: muted.username,
            icon: muted.avatar?.filename
          })),
          messages: data.createChannel.messages.map((message: any) => ({
            text: message.text,
            sender: message.sender,
            senderId: message.senderId,
            time: message.time,
            read: true,
          }))
        };

        console.log("Channel created: ", channel.id);
        console.log("Add moderator: ", addModerator);
        console.log("Add member: ", addMember);
        if (addModerator.length !== 0) {
          addModerator.forEach((id) => {
            // skip empty ids
            if (id === '') return;
            console.log("Adding moderator: ", id);
            addAdminMutation({
              variables: {
                cid: channel.id,
                uid: id,
              }
            }).then((result) => {
              admins.push({
                id: result.data.addAdmin.id,
                name: result.data.addAdmin.username,
                icon: result.data.addAdmin.avatar?.filename,
              });
            });
          });
        }
        if (addMember.length !== 0) {
          addMember.forEach((id) => {
            // skip empty ids
            if (id === '') return;
            console.log("Adding member: ", id);
            addMemberMutation({
              variables: {
                cid: channel.id,
                uid: id,
              }
            }).then((result) => {
              members.push({
                id: result.data.addMember.id,
                name: result.data.addMember.username,
                icon: result.data.addMember.avatar?.filename,
                xp: result.data.addMember.xp,
                status: result.data.addMember.status,
                blocked: result.data.addMember.blocked?.map((blocker: { blockedUserId: string }) => blocker.blockedUserId),
                blocken: result.data.addMember.blocking?.map((blocking: { blockerId: string }) => blocking.blockerId),
              });
            });
          });
        }

        channel.admins = admins;
        channel.members = members;
        // if (channel.icon === null)
        //   channel.icon = '/Chat/chatBanner.png';
        setChannels((prevChannels: any) => [channel, ...prevChannels]);
        setPassword('');
        setTitle('');
        setDescription('');
        setPassword2('');
        setAddMember([]);
        setAddModerator([]);
        setpfp('');
      } catch (e) {
        console.log("Error: ", e);
      }
    };

    const cld = new Cloudinary({
      cloud: {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }
    });

    const uploadAvatar = async (selectedFile: any) => {
      const imageCompressor = new ImageCompressor(); // Instantiate ImageCompressor
      const compressedFile = await imageCompressor.compress(selectedFile, { // Use compress method
        maxWidth: 500,
        maxHeight: 500,
        quality: 0.5, // Adjust quality as needed
      });
      const data = new FormData();
      data.append("file", compressedFile);
      data.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );
      data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
      data.append("folder", "Cloudinary-React");


      // Specify the image quality here (between 0 to 100)
      // data.append("quality", '10');
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );
        const res = await response.json();
        // setUploadUrl(res.public_id);
        return (cld.image(res.public_id).toURL());
      } catch (error) {
        console.log("ERROR");
        return '';
      }
    };

    async function loadFile(event: ChangeEvent<HTMLInputElement>) {
      const image = document.getElementById('output') as HTMLImageElement;
      if (image && event.target.files) {
        image.src = URL.createObjectURL(event.target.files[0]);
        const uploadedImg = await uploadAvatar(event.target.files[0]);
        setpfp(uploadedImg);
      }
    }


    return (

      <div className="h-full w-full overflow-hidden relative flex flex-col justify-between rounded-2xl overflow-y-auto pt-4 px-3 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent">
        <div>
          <div className="flex flex-col gap-4">
            <div className="profile-pic">
              <label className="-label" htmlFor="file">
                <CiCamera />
                <span>Change Image</span>
              </label>
              <input id="file" type="file" onChange={(event) => loadFile(event)} />
              <img src="/Chat/chatBanner.png" id="output" width="200" referrerPolicy="no-referrer" />
              <div className="lock-icon">
                <button onClick={toggleLock} className="p-2 rounded-full bg-pink-200 hover:bg-pink-300 transition duration-300">
                  {!lock ? <CiLock className="text-pink-500" /> : <CiUnlock className="text-pink-600" />}
                </button>
              </div>
            </div>
          </div>
          <div className="setTitleContainer">
            <input
              type="text"
              className="setTitleInput"
              placeholder="set room title ..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={12}
              autoFocus
            />
          </div>

          <div className="descriptionContainer">
            <textarea
              placeholder="description ..."
              className="descriptionInput"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoFocus
              maxLength={100}
            />
          </div>
          <MdOutlineCheckCircle
            className='w-10 h-10 text-white'
            style={{ position: 'fixed', bottom: '7px', left: '40%', cursor: 'pointer' }}
            onClick={handleCreateChannel}
          />
          <MdOutlineCancel
            className='w-10 h-10 text-white'
            style={{ position: 'fixed', bottom: '7px', left: '55%', cursor: 'pointer' }}
            onClick={() => setDisplay('')}
          />
          <div className="members-container">
            <div className="friend-list">
              {friendsItems.map((friend: { icon: string; name: string; xp: number; id: string; }, index: number) => (
                <div key={index} className="friend-box">
                  <div className="friend-profile" style={{ backgroundImage: `url(${friend.icon})` }}></div>
                  <div className="username-box">{`@${friend.name}`}</div>
                  <div className="level-indicator">{`Level ${friend.xp / 100}`}</div>
                  <button
                    className="icon-button"
                    onClick={() => {
                      if (addModerator.includes(friend.id)) {
                        setAddModerator((prevAddModerator: string[]) =>
                          prevAddModerator.filter((id) => id !== friend.id)
                        );
                      } else {
                        setAddModerator((prevAddModerator: string[]) => [
                          ...prevAddModerator,
                          String(friend.id)
                        ]);
                        if (addMember.includes(friend.id)) {
                          setAddMember((prevAddMember: string[]) =>
                            prevAddMember.filter((id) => id !== friend.id)
                          );
                        }
                      }
                    }}
                  >
                    {addModerator.includes(friend.id) ?
                      <MdAddModerator className="moderator-icon" title="remove mod" />
                      :
                      <MdOutlineAddModerator className="moderator-icon" title="add mod" />}
                  </button>
                  <button
                    className="icon-button"
                    onClick={() => {
                      if (addMember.includes(String(friend.id))) {
                        setAddMember((prevAddMember: string[]) =>
                          prevAddMember.filter((id) => id !== String(friend.id))
                        );
                      } else {
                        setAddMember((prevAddMember: string[]) => [
                          ...prevAddMember,
                          String(friend.id)
                        ]);
                        if (addModerator.includes(String(friend.id))) {
                          setAddModerator((prevAddModerator: string[]) =>
                            prevAddModerator.filter((id) => id !== String(friend.id))
                          );
                        }
                      }
                    }}
                  >
                    {addMember.includes(String(friend.id)) ?
                      <IoIosAddCircle className="regular-member-icon" title="remove member" />
                      :
                      <IoIosAddCircleOutline className="regular-member-icon" title="add member" />}
                  </button>
                </div>))}
            </div>
          </div>
        </div>
        {!lock && showPasswordContainer && (
          <div className="absolute h-full z-50 bg-purple-400 backdrop-blur-md bg-opacity-50 w-full flex justify-center items-center inset-0">
            <div className="bg-white p-5 space-y-3 bg-opacity-50 overflow-hidden rounded-md w-1/3">
              <div className="flex gap-2 justify-end mt-2">
              </div>
              <div className="flex flex-col gap-2">
                <input type="password" onChange={(e) => setPassword(e.target.value)} className="p-2 bg-purple-400 bg-opacity-30 rounded-md text-white" placeholder="Enter a password" />
                <input type="password" onChange={(e) => setPassword2(e.target.value)} className="p-2 bg-purple-400 bg-opacity-30 rounded-md text-white" placeholder="Re-enter a password" />
              </div>
              {passwordMismatch && <p>Passwords do not match. Please try again.</p>}
              <div className="flex gap-2 justify-center">
                <div className="w-10">
                  <button onClick={handlePasswordSubmit}>
                    <MdOutlineCheckCircle className='w-10 h-10 text-white' />
                  </button>
                </div>
                <div className="w-10 aspect-square">
                  <button onClick={handlePasswordDiscard}>
                    <MdOutlineCancel className='w-10 h-10 text-white' />
                  </button>
                </div>
              </div>
            </div>
          </div>)}
      </div>
    );
  }

export default NewRoom;