import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';
import NotificationStats from '../../components/admin/Notification/NotificationStats';
import NotificationList from '../../components/admin/Notification/NotificationList';
import NotificationFilters from '../../components/admin/Notification/NotificationFilters';
import BulkNotificationModal from '../../components/admin/Notification/BulkNotificationModal';
import '../../styles/admin/NotificationManagement.css';

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    type: 'all',
    search: '',
    dateFrom: '',
    dateTo: ''
  });
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin-notifications/all', {
        params: {
          page: currentPage,
          limit: 20,
          type: filters.type !== 'all' ? filters.type : undefined
        }
      });

      if (response.data.success) {
        setNotifications(response.data.data);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Lỗi khi tải danh sách thông báo');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters.type]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/admin-notifications/stats');

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Delete notification
  const handleDelete = async (notificationId) => {
    if (!window.confirm('Bạn có chắc muốn xóa thông báo này?')) return;

    try {
      await api.delete(`/admin-notifications/${notificationId}`);

      toast.success('Đã xóa thông báo');
      fetchNotifications();
      fetchStats();
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Lỗi khi xóa thông báo');
    }
  };

  // Send bulk notification
  const handleSendBulk = async (data) => {
    try {
      await api.post('/admin-notifications/send-bulk', data);

      toast.success('Đã gửi thông báo thành công');
      setShowBulkModal(false);
      fetchNotifications();
      fetchStats();
    } catch (error) {
      console.error('Error sending bulk notification:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi gửi thông báo');
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        notif.message?.toLowerCase().includes(searchLower) ||
        notif.username?.toLowerCase().includes(searchLower) ||
        notif.full_name?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="qltb-notification-page">
      {/* Page Header */}
      <div className="qltb-page-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <div>
          <h1 className="qltb-page-title">Quản lý Thông báo</h1>
          <p className="qltb-page-subtitle">Xem và quản lý tất cả thông báo của hệ thống</p>
        </div>
        <button 
          onClick={() => setShowBulkModal(true)} 
          className="qltb-btn qltb-btn-primary"
        >
          <i className="bi bi-megaphone"></i> Gửi thông báo hàng loạt
        </button>
      </div>

      {/* Stats */}
      {stats && <NotificationStats stats={stats} />}

      {/* Filters */}
      <NotificationFilters 
        filters={filters}
        setFilters={setFilters}
        onRefresh={fetchNotifications}
      />

      {/* List */}
      {loading ? (
        <div className="qltb-loading">
          <i className="bi bi-arrow-repeat"></i>
          <p>Đang tải...</p>
        </div>
      ) : (
        <>
          <NotificationList
            notifications={filteredNotifications}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="qltb-pagination">
              <button
                className="qltb-pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                <i className="bi bi-chevron-left"></i> Trước
              </button>
              <span className="qltb-pagination-info">Trang {currentPage} / {totalPages}</span>
              <button
                className="qltb-pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Sau <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          )}
        </>
      )}

      {/* Bulk Modal */}
      {showBulkModal && (
        <BulkNotificationModal
          onClose={() => setShowBulkModal(false)}
          onSend={handleSendBulk}
        />
      )}
    </div>
  );
};

export default NotificationManagement;