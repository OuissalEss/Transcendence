import { ChangeEvent, Key, useEffect, useState } from "react";
import { CiCamera, CiLock, CiUnlock } from "react-icons/ci";
import { HiUserGroup } from "react-icons/hi";
import { IoIosAddCircleOutline, IoIosAddCircle } from "react-icons/io";
import { MdOutlineAddModerator, MdOutlineCheckCircle, MdOutlineCancel, MdAddModerator } from "react-icons/md";
import { channelType, NewRoomProps } from "../../interfaces/props";
import { useMutation } from '@apollo/client';
import { CREATE_CHANNEL, ADD_MEMBER, ADD_ADMIN } from "../../graphql/mutations";


const NewRoom: React.FC<NewRoomProps>= ({
  setDisplay,
  setChannels,
}) => {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [title, setTitle] = useState('');
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
  const admins: { id: string; name: string; icon: string; }[] = [];
  const members: { id: string; name: string; icon: string; status: string; blocked: string[]; blocken: string[];}[] = [];

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
      const createChannelInput = {
        title: title,
        description: description || null,
        type: (lock ? "PUBLIC" : (password != '' ? "PROTECTED" : "PRIVATE")),
        password: password || null,
        profileImage: document.getElementById('output')?.getAttribute('src') || '../../../public/assets/chatBanner.png',
        ownerId: JSON.parse(localStorage.getItem('user') || '{}').id,
      };
      const { data } = await createChannelMutation({
        variables: { createChannelInput }
      });
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
          icon: data.createChannel.owner.avatarTest
        },
        admins: data.createChannel.admins.map((admin: { id: string, username: string, avatarTest: string }) => ({
          id: admin.id,
          name: admin.username,
          icon: admin.avatarTest
        })),
        members: data.createChannel.members.map((member: { id: string, username: string, avatarTest: string, status: string, blocked: {blockedUserId: string;}[], blocking: {blockerId: string;}[]}) => ({
          id: member.id,
          name: member.username,
          icon: member.avatarTest,
          status: member.status,
          blocked: member.blocked.map((blocker: { blockedUserId: string }) => blocker.blockedUserId),
          blocken: member.blocking.map((blocking: { blockerId: string }) => blocking.blockerId)
        })),
        banned: data.createChannel.banned.map((banned: { id: string, username: string, avatarTest: string }) => ({
          id: banned.id,
          name: banned.username,
          icon: banned.avatarTest
        })),
        muted: data.createChannel.muted.map((muted: { id: string, username: string, avatarTest: string }) => ({
          id: muted.id,
          name: muted.username,
          icon: muted.avatarTest
        })),
        messages: data.createChannel.messages.map((message: { id: string, text: string, time: Date, sender: string, senderId: string }) => ({
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
              icon: result.data.addAdmin.avatarTest,
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
              icon: result.data.addMember.avatarTest,
              status: result.data.addMember.status,
              blocked: result.data.addMember.blocked.map((blocker: { blockedUserId: string }) => blocker.blockedUserId),
              blocken: result.data.addMember.blocking.map((blocking: { blockerId: string }) => blocking.blockerId),
            });
          });
        });
    }

      channel.admins = admins;
      channel.members = members;
      if (channel.icon === null)
        channel.icon = '../../../public/assets/chatBanner.png';
      setChannels((prevChannels: any) => [channel, ...prevChannels]);
      setPassword('');
      setTitle('');
      setDescription('');
      setPassword2('');
      setAddMember([]);
      setAddModerator([]);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

  function loadFile(event: ChangeEvent<HTMLInputElement>): void {
		const image = document.getElementById('output') as HTMLImageElement;
		if (image && event.target.files) {
			image.src = URL.createObjectURL(event.target.files[0]);
		}
	}

  
  return (
    
    <div className="h-full w-full overflow-hidden relative flex flex-col justify-between rounded-2xl overflow-y-auto pt-4 px-3 scrollbar-thin scrollbar-thumb-transparent scrollbar-track-transparent">
        <div>
            <div className="flex flex-col gap-4">
              <div className="profile-pic">
                <label className="-label" htmlFor="file">
                  <CiCamera/>
                  <span>Change Image</span>
                </label>
                <input id="file" type="file" onChange={(event) => loadFile(event)}/>
                <img src="../../../public/assets/chatBanner.png" id="output" width="200" />
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
                autoFocus
                />									
            </div>

            <div className="descriptionContainer">
              <input
                type="text"
                placeholder="description ..."
                className="descriptionInput"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoFocus
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
                      <MdAddModerator className="moderator-icon" title="remove mod"/> 
                      :
                      <MdOutlineAddModerator className="moderator-icon" title="add mod"/>}
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
                      <IoIosAddCircle className="regular-member-icon" title="remove member"/>
                      :
                      <IoIosAddCircleOutline className="regular-member-icon" title="add member"/>}
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
              <input type="password" onChange={(e) => setPassword2(e.target.value)}  className="p-2 bg-purple-400 bg-opacity-30 rounded-md text-white" placeholder="Re-enter a password" />
            </div>
            {passwordMismatch && <p>Passwords do not match. Please try again.</p>}
            <div className="flex gap-2 justify-center">
              <div className="w-10">
                <button onClick={handlePasswordSubmit}>
                  <MdOutlineCheckCircle className='w-10 h-10 text-white'/>
                </button>
              </div>
            <div className="w-10 aspect-square">
              <button onClick={handlePasswordDiscard}>
                <MdOutlineCancel className='w-10 h-10 text-white'/>
              </button>		
            </div>
          </div>
        </div>
      </div> )}
      </div>
  );
}

export default NewRoom;