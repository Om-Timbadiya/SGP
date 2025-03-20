import React, { useState } from 'react';
import { MessageSquare, Heart, Reply, Share2, MoreHorizontal } from 'lucide-react';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  replies: Reply[];
  isLiked: boolean;
}

interface Reply {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
}

export default function DiscussionForum() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: {
        name: 'Alex Johnson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        role: 'Student',
      },
      content: 'How do you prepare for the practical assessment in web development? Any tips would be helpful!',
      timestamp: new Date('2024-03-15T10:00:00'),
      likes: 24,
      isLiked: false,
      replies: [
        {
          id: '1-1',
          author: {
            name: 'Sarah Chen',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          },
          content: 'Practice with real-world projects and focus on responsive design. The practical usually includes both frontend and backend tasks.',
          timestamp: new Date('2024-03-15T10:30:00'),
          likes: 12,
          isLiked: false,
        },
      ],
    },
    {
      id: '2',
      author: {
        name: 'Maria Garcia',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        role: 'Instructor',
      },
      content: 'Important announcement: We\'ve added new accessibility features for the upcoming assessments. Check out the tutorial video in the help section!',
      timestamp: new Date('2024-03-14T15:00:00'),
      likes: 45,
      isLiked: true,
      replies: [],
    },
  ]);

  const [newPost, setNewPost] = useState('');
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          isLiked: !post.isLiked,
        };
      }
      return post;
    }));
  };

  const handleReplyLike = (postId: string, replyId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const updatedReplies = post.replies.map(reply => {
          if (reply.id === replyId) {
            return {
              ...reply,
              likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
              isLiked: !reply.isLiked,
            };
          }
          return reply;
        });
        return { ...post, replies: updatedReplies };
      }
      return post;
    }));
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      author: {
        name: 'Current User',
        avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNa1JGLFIadWHMQ0KvIuKWYGl-cxLwGlI2WA&s',
        role: 'Student',
      },
      content: newPost,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
      replies: [],
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleSubmitReply = (postId: string) => {
    if (!replyContent[postId]?.trim()) return;

    setPosts(posts.map(post => {
      if (post.id === postId) {
        const reply: Reply = {
          id: `${postId}-${post.replies.length + 1}`,
          author: {
            name: 'Current User',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
          },
          content: replyContent[postId],
          timestamp: new Date(),
          likes: 0,
          isLiked: false,
        };
        return { ...post, replies: [...post.replies, reply] };
      }
      return post;
    }));

    setReplyContent({ ...replyContent, [postId]: '' });
  };

  return (
    <div className="max-w-3xl mx-auto py-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Discussion Forum</h2>
        <form onSubmit={handleSubmitPost} className="bg-white rounded-lg shadow p-4">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Start a discussion..."
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows={3}
          />
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Post
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow">
            <div className="p-4">
              <div className="flex items-center space-x-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-medium text-gray-900">
                      {post.author.name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      {post.author.role}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {post.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-gray-900">{post.content}</p>

              <div className="mt-4 flex items-center space-x-4">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-1 ${
                    post.isLiked ? 'text-red-600' : 'text-gray-500'
                  }`}
                >
                  <Heart className="h-5 w-5" fill={post.isLiked ? 'currentColor' : 'none'} />
                  <span>{post.likes}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500">
                  <MessageSquare className="h-5 w-5" />
                  <span>{post.replies.length}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-500">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              {post.replies.length > 0 && (
                <div className="mt-4 space-y-4">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="pl-6 border-l-2 border-gray-100">
                      <div className="flex items-center space-x-3">
                        <img
                          src={reply.author.avatar}
                          alt={reply.author.name}
                          className="h-8 w-8 rounded-full"
                        />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {reply.author.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {reply.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-900">{reply.content}</p>
                      <div className="mt-2 flex items-center space-x-4">
                        <button
                          onClick={() => handleReplyLike(post.id, reply.id)}
                          className={`flex items-center space-x-1 ${
                            reply.isLiked ? 'text-red-600' : 'text-gray-500'
                          }`}
                        >
                          <Heart
                            className="h-4 w-4"
                            fill={reply.isLiked ? 'currentColor' : 'none'}
                          />
                          <span className="text-sm">{reply.likes}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={replyContent[post.id] || ''}
                    onChange={(e) =>
                      setReplyContent({ ...replyContent, [post.id]: e.target.value })
                    }
                    placeholder="Write a reply..."
                    className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => handleSubmitReply(post.id)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}