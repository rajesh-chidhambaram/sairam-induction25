"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function Dashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const router = useRouter();

  // Check authentication status
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard/auth");
      const data = await response.json();

      if (response.ok && data.authenticated) {
        setAuthenticated(true);
        setSessionExpiry(data.expiresAt);
        return true;
      } else {
        setAuthenticated(false);
        router.push("/dashboard/login");
        return false;
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setAuthenticated(false);
      router.push("/dashboard/login");
      return false;
    }
  }, [router]);

  // Fetch dashboard statistics
  const fetchStats = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await fetch("/api/dashboard/stats");
      
      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        router.push("/dashboard/login");
        return;
      }

      const data = await response.json();

      if (response.ok) {
        setStats(data.data);
      } else {
        toast.error(data.message || "Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Stats fetch error:", error);
      toast.error("Unable to fetch dashboard data. Please try again.");
    } finally {
      setRefreshing(false);
    }
  }, [router]);

  // Logout function
  const handleLogout = async () => {
    try {
      await fetch("/api/dashboard/auth", { method: "DELETE" });
      toast.success("Logged out successfully");
      router.push("/dashboard/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  // Initial load
  useEffect(() => {
    const initDashboard = async () => {
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        await fetchStats();
      }
      setLoading(false);
    };

    initDashboard();
  }, [checkAuth, fetchStats]);

  // Auto-refresh stats every 30 seconds
  useEffect(() => {
    if (!authenticated) return;

    const interval = setInterval(() => {
      fetchStats();
    }, 30000);

    return () => clearInterval(interval);
  }, [authenticated, fetchStats]);

  // Session expiry warning
  useEffect(() => {
    if (!sessionExpiry) return;

    const checkExpiry = () => {
      const timeUntilExpiry = sessionExpiry - Date.now();
      const minutesUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60));

      if (minutesUntilExpiry <= 2 && minutesUntilExpiry > 0) {
        toast.warning(`Session expires in ${minutesUntilExpiry} minute(s)`);
      }
    };

    const warningInterval = setInterval(checkExpiry, 60000); // Check every minute
    return () => clearInterval(warningInterval);
  }, [sessionExpiry]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Sairam Induction 2025 Dashboard
              </h1>
              <p className="text-gray-600">Real-time registration monitoring</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={fetchStats}
                loading={refreshing}
                size="sm"
                variant="outline"
              >
                {refreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Button
                onClick={handleLogout}
                size="sm"
                variant="outline"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {stats && (
          <>
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {stats.overview.totalRegistrations}
                  </div>
                  <div className="text-gray-600 text-sm">Total Registrations</div>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {stats.overview.totalAccompanyingPeople}
                  </div>
                  <div className="text-gray-600 text-sm">Total Accompanying</div>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {stats.overview.totalWithAccompanying}
                  </div>
                  <div className="text-gray-600 text-sm">With Accompanying</div>
                </div>
              </Card>

              <Card>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {stats.overview.averageAccompanying}
                  </div>
                  <div className="text-gray-600 text-sm">Average Accompanying</div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Registrations */}
              <Card title="Recent Registrations">
                <div className="space-y-3">
                  {stats.recentRegistrations.length > 0 ? (
                    stats.recentRegistrations.map((reg, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div>
                          <div className="font-medium">{reg.name}</div>
                          <div className="text-sm text-gray-500">ID: {reg.id}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {reg.parentCount} accompanying
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(reg.registeredAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No registrations yet</p>
                  )}
                </div>
              </Card>

              {/* Recent Updates */}
              <Card title="Recent Updates">
                <div className="space-y-3">
                  {stats.recentUpdates.length > 0 ? (
                    stats.recentUpdates.map((update, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <div>
                          <div className="font-medium">{update.name}</div>
                          <div className="text-sm text-gray-500">ID: {update.id}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {update.parentCount} accompanying
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(update.updatedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No updates yet</p>
                  )}
                </div>
              </Card>

              {/* Distribution Chart */}
              <Card title="Accompanying Count Distribution" className="lg:col-span-2">
                <div className="space-y-3">
                  {stats.distribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {item.accompanyingCount} {item.accompanyingCount === 1 ? 'person' : 'people'}
                      </span>
                      <div className="flex items-center space-x-3 flex-1 ml-4">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{
                              width: `${(item.studentCount / stats.overview.totalRegistrations) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {item.studentCount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Last Updated */}
            <div className="mt-8 text-center text-sm text-gray-500">
              Last updated: {new Date(stats.lastUpdated).toLocaleString()}
              <br />
              Auto-refreshes every 30 seconds
            </div>
          </>
        )}
      </div>
    </div>
  );
}