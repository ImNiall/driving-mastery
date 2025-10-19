import React, { useState, useEffect } from "react";
import { ProgressService } from "@/lib/services/progress";

interface StudyGroup {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  is_private: boolean;
  invite_code: string | null;
  memberCount: number;
  role?: string;
  joinedAt?: string;
  created_at: string;
}

interface GroupMember {
  rank: number;
  name: string;
  role: string;
  masteryPoints: number;
  currentStreak: number;
  totalQuizzes: number;
  averageScore: number;
  weeklyPoints: number;
  isCurrentUser: boolean;
  joinedAt: string;
}

const StudyGroups: React.FC = () => {
  const [userGroups, setUserGroups] = useState<StudyGroup[]>([]);
  const [publicGroups, setPublicGroups] = useState<StudyGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [groupLeaderboard, setGroupLeaderboard] = useState<GroupMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);

  // Form states
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [joinGroupId, setJoinGroupId] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetchGroupLeaderboard(selectedGroup.id);
    }
  }, [selectedGroup]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      // This would call a new study groups API endpoint
      // For now, using mock data
      const mockUserGroups: StudyGroup[] = [
        {
          id: "1",
          name: "Theory Masters",
          description: "Dedicated group for mastering driving theory",
          created_by: "user1",
          is_private: false,
          invite_code: null,
          memberCount: 15,
          role: "member",
          joinedAt: "2024-01-15T10:00:00Z",
          created_at: "2024-01-10T10:00:00Z",
        },
      ];

      const mockPublicGroups: StudyGroup[] = [
        {
          id: "2",
          name: "UK Drivers United",
          description: "Open community for all UK learner drivers",
          created_by: "user2",
          is_private: false,
          invite_code: null,
          memberCount: 42,
          created_at: "2024-01-05T10:00:00Z",
        },
        {
          id: "3",
          name: "Speed Learners",
          description: "Fast-track your theory test preparation",
          created_by: "user3",
          is_private: false,
          invite_code: null,
          memberCount: 28,
          created_at: "2024-01-20T10:00:00Z",
        },
      ];

      setUserGroups(mockUserGroups);
      setPublicGroups(mockPublicGroups);

      if (mockUserGroups.length > 0) {
        setSelectedGroup(mockUserGroups[0] || null);
      }
    } catch (error) {
      console.error("Fetch groups error:", error);
      setMessage({ type: "error", text: "Failed to load study groups" });
    } finally {
      setLoading(false);
    }
  };

  const fetchGroupLeaderboard = async (groupId: string) => {
    try {
      // Mock group leaderboard data
      const mockLeaderboard: GroupMember[] = [
        {
          rank: 1,
          name: "Sarah M.",
          role: "owner",
          masteryPoints: 1250,
          currentStreak: 15,
          totalQuizzes: 45,
          averageScore: 92,
          weeklyPoints: 180,
          isCurrentUser: false,
          joinedAt: "2024-01-10T10:00:00Z",
        },
        {
          rank: 2,
          name: "You",
          role: "member",
          masteryPoints: 980,
          currentStreak: 8,
          totalQuizzes: 32,
          averageScore: 87,
          weeklyPoints: 145,
          isCurrentUser: true,
          joinedAt: "2024-01-15T10:00:00Z",
        },
        {
          rank: 3,
          name: "Mike R.",
          role: "admin",
          masteryPoints: 875,
          currentStreak: 12,
          totalQuizzes: 38,
          averageScore: 84,
          weeklyPoints: 120,
          isCurrentUser: false,
          joinedAt: "2024-01-12T10:00:00Z",
        },
      ];

      setGroupLeaderboard(mockLeaderboard);
    } catch (error) {
      console.error("Fetch group leaderboard error:", error);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    try {
      setMessage(null);
      // API call would go here
      setMessage({
        type: "success",
        text: `Group "${groupName}" created successfully!`,
      });
      setShowCreateForm(false);
      setGroupName("");
      setGroupDescription("");
      setIsPrivate(false);
      fetchGroups();
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to create group",
      });
    }
  };

  const handleJoinGroup = async (groupId: string, inviteCode?: string) => {
    try {
      setMessage(null);
      // API call would go here
      setMessage({ type: "success", text: "Joined group successfully!" });
      fetchGroups();
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to join group",
      });
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    if (!confirm("Are you sure you want to leave this group?")) return;

    try {
      setMessage(null);
      // API call would go here
      setMessage({ type: "success", text: "Left group successfully" });
      fetchGroups();
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(null);
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to leave group",
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return "👑";
      case "admin":
        return "⭐";
      default:
        return "👤";
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-yellow-100 text-yellow-800";
      case "admin":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Study Groups 👥
          </h1>
          <p className="text-gray-600">
            Join groups to study together and compete with friends
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setShowJoinForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Join Group
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Create Group
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Groups List */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* My Groups */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                My Groups ({userGroups.length})
              </h3>
              <div className="space-y-3">
                {userGroups.map((group) => (
                  <div
                    key={group.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedGroup?.id === group.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedGroup(group)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        {group.name}
                      </h4>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(group.role || "member")}`}
                      >
                        {getRoleIcon(group.role || "member")} {group.role}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {group.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{group.memberCount} members</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLeaveGroup(group.id);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Leave
                      </button>
                    </div>
                  </div>
                ))}

                {userGroups.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>You haven&apos;t joined any groups yet</p>
                    <p className="text-sm mt-1">
                      Create or join a group to get started!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Public Groups */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Public Groups
              </h3>
              <div className="space-y-3">
                {publicGroups.map((group) => (
                  <div
                    key={group.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        {group.name}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {group.memberCount} members
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {group.description}
                    </p>
                    <button
                      onClick={() => handleJoinGroup(group.id)}
                      className="w-full px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                    >
                      Join Group
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Group Details & Leaderboard */}
        <div className="lg:col-span-2">
          {selectedGroup ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedGroup.name}
                  </h2>
                  <p className="text-gray-600">{selectedGroup.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>{selectedGroup.memberCount} members</span>
                    <span>•</span>
                    <span>
                      {selectedGroup.is_private ? "🔒 Private" : "🌍 Public"}
                    </span>
                    {selectedGroup.invite_code && (
                      <>
                        <span>•</span>
                        <span>
                          Code: <strong>{selectedGroup.invite_code}</strong>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Group Leaderboard */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Group Leaderboard
                </h3>
                <div className="space-y-2">
                  {groupLeaderboard.map((member) => (
                    <div
                      key={member.rank}
                      className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                        member.isCurrentUser
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-8 text-center font-bold text-gray-600">
                          {member.rank <= 3 ? (
                            <span className="text-lg">
                              {member.rank === 1
                                ? "🥇"
                                : member.rank === 2
                                  ? "🥈"
                                  : "🥉"}
                            </span>
                          ) : (
                            member.rank
                          )}
                        </div>

                        <div>
                          <div
                            className={`flex items-center space-x-2 ${
                              member.isCurrentUser
                                ? "font-bold text-blue-600"
                                : "font-medium text-gray-900"
                            }`}
                          >
                            <span>{member.name}</span>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(member.role)}`}
                            >
                              {getRoleIcon(member.role)} {member.role}
                            </span>
                          </div>

                          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                            <span>{member.totalQuizzes} quizzes</span>
                            <span>Avg: {member.averageScore}%</span>
                            {member.currentStreak > 0 && (
                              <span className="text-orange-600">
                                🔥 {member.currentStreak}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-gray-700">
                          {member.masteryPoints.toLocaleString()}{" "}
                          <span className="text-xs text-gray-500">MP</span>
                        </div>
                        {member.weeklyPoints > 0 && (
                          <div className="text-xs text-green-600">
                            +{member.weeklyPoints} this week
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">
              <p>Select a group to view its leaderboard</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create Study Group</h3>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter group name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={groupDescription}
                  onChange={(e) => setGroupDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your group"
                  rows={3}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="isPrivate" className="text-sm text-gray-700">
                  Make group private (requires invite code)
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Group Modal */}
      {showJoinForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Join Private Group</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleJoinGroup(joinGroupId, inviteCode);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invite Code
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter 8-character invite code"
                  maxLength={8}
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowJoinForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Join Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyGroups;
